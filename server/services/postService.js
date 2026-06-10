const { sql, poolPromise } = require("../config/db");
const ApiError = require("../utils/ApiError");
const { mapPost } = require("../utils/feedMapper");
const { getLikeInfoForTargets } = require("./likeService");

const buildIdInputs = (request, postIds) => {
  const placeholders = postIds.map((id, index) => {
    const param = `postId${index}`;
    request.input(param, sql.Int, id);
    return `@${param}`;
  });

  return placeholders.join(", ");
};

const getCommentCounts = async (postIds) => {
  if (!postIds.length) {
    return {};
  }

  const pool = await poolPromise;
  const request = pool.request();
  const idList = buildIdInputs(request, postIds);

  const result = await request.query(
    `SELECT post_id, COUNT(*) AS comment_count
     FROM comments
     WHERE post_id IN (${idList})
     GROUP BY post_id`,
  );

  const counts = {};
  postIds.forEach((id) => {
    counts[id] = 0;
  });
  result.recordset.forEach((row) => {
    counts[row.post_id] = row.comment_count;
  });

  return counts;
};

const getFeedPosts = async (userId) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .query(
      `SELECT p.id, p.user_id, p.text, p.image_url, p.visibility, p.created_at,
              u.first_name, u.last_name
       FROM posts p
       INNER JOIN users u ON u.id = p.user_id
       WHERE p.visibility = 'public' OR p.user_id = @userId
       ORDER BY p.created_at DESC`,
    );

  const posts = result.recordset;
  const postIds = posts.map((p) => p.id);
  const likeInfoMap = await getLikeInfoForTargets("post", postIds, userId);
  const commentCounts = await getCommentCounts(postIds);

  return posts.map((row) =>
    mapPost(row, likeInfoMap[row.id], commentCounts[row.id] || 0),
  );
};

const createPost = async ({ userId, text, imageUrl, visibility }) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("text", sql.NVarChar(sql.MAX), text)
    .input("imageUrl", sql.NVarChar(500), imageUrl || null)
    .input("visibility", sql.NVarChar(10), visibility)
    .query(
      `INSERT INTO posts (user_id, text, image_url, visibility)
       OUTPUT INSERTED.id, INSERTED.user_id, INSERTED.text, INSERTED.image_url,
              INSERTED.visibility, INSERTED.created_at
       VALUES (@userId, @text, @imageUrl, @visibility)`,
    );

  const post = result.recordset[0];

  const userResult = await pool
    .request()
    .input("userId", sql.Int, userId)
    .query(
      `SELECT first_name, last_name FROM users WHERE id = @userId`,
    );

  const user = userResult.recordset[0];

  return mapPost(
    { ...post, first_name: user.first_name, last_name: user.last_name },
    { likeCount: 0, isLiked: false, likedBy: [] },
    0,
  );
};

const deletePost = async ({ postId, userId }) => {
  const pool = await poolPromise;

  const existing = await pool
    .request()
    .input("postId", sql.Int, postId)
    .query(`SELECT id, user_id FROM posts WHERE id = @postId`);

  const post = existing.recordset[0];
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.user_id !== userId) {
    throw new ApiError(403, "You can only delete your own posts");
  }

  await pool
    .request()
    .input("postId", sql.Int, postId)
    .query(`DELETE FROM posts WHERE id = @postId`);
};

module.exports = {
  getFeedPosts,
  createPost,
  deletePost,
};
