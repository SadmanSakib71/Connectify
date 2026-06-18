const { poolPromise, buildInClause } = require("../config/db");
const ApiError = require("../utils/ApiError");
const { mapPost } = require("../utils/feedMapper");
const { getLikeInfoForTargets } = require("./likeService");

const getCommentCounts = async (postIds) => {
  if (!postIds.length) {
    return {};
  }

  const pool = await poolPromise;
  const { placeholders, values } = buildInClause(postIds);

  const result = await pool.query(
    `SELECT post_id, COUNT(*) AS comment_count
     FROM comments
     WHERE post_id IN (${placeholders})
     GROUP BY post_id`,
    values,
  );

  const counts = {};
  postIds.forEach((id) => {
    counts[id] = 0;
  });
  result.rows.forEach((row) => {
    counts[row.post_id] = Number(row.comment_count);
  });

  return counts;
};

const getFeedPosts = async (userId) => {
  const pool = await poolPromise;

  const result = await pool.query(
    `SELECT p.id, p.user_id, p.text, p.image_url, p.visibility, p.created_at,
            u.first_name, u.last_name
     FROM posts p
     INNER JOIN users u ON u.id = p.user_id
     WHERE p.visibility = 'public' OR p.user_id = $1
     ORDER BY p.created_at DESC`,
    [userId],
  );

  const posts = result.rows;
  const postIds = posts.map((p) => p.id);
  const likeInfoMap = await getLikeInfoForTargets("post", postIds, userId);
  const commentCounts = await getCommentCounts(postIds);

  return posts.map((row) =>
    mapPost(row, likeInfoMap[row.id], commentCounts[row.id] || 0),
  );
};

const createPost = async ({ userId, text, imageUrl, visibility }) => {
  const pool = await poolPromise;

  const result = await pool.query(
    `INSERT INTO posts (user_id, text, image_url, visibility)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, text, image_url, visibility, created_at`,
    [userId, text, imageUrl || null, visibility],
  );

  const post = result.rows[0];

  const userResult = await pool.query(
    `SELECT first_name, last_name FROM users WHERE id = $1`,
    [userId],
  );

  const user = userResult.rows[0];

  return mapPost(
    { ...post, first_name: user.first_name, last_name: user.last_name },
    { likeCount: 0, isLiked: false, likedBy: [] },
    0,
  );
};

const deletePost = async ({ postId, userId }) => {
  const pool = await poolPromise;

  const existing = await pool.query(
    `SELECT id, user_id FROM posts WHERE id = $1`,
    [postId],
  );

  const post = existing.rows[0];
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.user_id !== userId) {
    throw new ApiError(403, "You can only delete your own posts");
  }

  await pool.query(`DELETE FROM posts WHERE id = $1`, [postId]);
};

module.exports = {
  getFeedPosts,
  createPost,
  deletePost,
};
