const { sql, poolPromise } = require("../config/db");
const ApiError = require("../utils/ApiError");
const { mapComment } = require("../utils/feedMapper");
const { getLikeInfoForTargets } = require("./likeService");
const replyService = require("./replyService");

const postExists = async (postId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("postId", sql.Int, postId)
    .query(`SELECT id FROM posts WHERE id = @postId`);

  return Boolean(result.recordset[0]);
};

const canAccessPost = async (postId, userId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("postId", sql.Int, postId)
    .input("userId", sql.Int, userId)
    .query(
      `SELECT id FROM posts
       WHERE id = @postId AND (visibility = 'public' OR user_id = @userId)`,
    );

  return Boolean(result.recordset[0]);
};

const getCommentsByPost = async ({ postId, userId }) => {
  const accessible = await canAccessPost(postId, userId);
  if (!accessible) {
    throw new ApiError(404, "Post not found");
  }

  const pool = await poolPromise;

  const result = await pool
    .request()
    .input("postId", sql.Int, postId)
    .query(
      `SELECT c.id, c.post_id, c.user_id, c.text, c.created_at,
              u.first_name, u.last_name
       FROM comments c
       INNER JOIN users u ON u.id = c.user_id
       WHERE c.post_id = @postId
       ORDER BY c.created_at ASC`,
    );

  const comments = result.recordset;
  const commentIds = comments.map((c) => c.id);
  const likeInfoMap = await getLikeInfoForTargets("comment", commentIds, userId);
  const repliesMap = await replyService.getRepliesByCommentIds(commentIds, userId);

  return comments.map((row) =>
    mapComment(
      row,
      likeInfoMap[row.id],
      repliesMap[row.id] || [],
    ),
  );
};

const addComment = async ({ postId, userId, text }) => {
  const accessible = await canAccessPost(postId, userId);
  if (!accessible) {
    throw new ApiError(404, "Post not found");
  }

  const pool = await poolPromise;

  const result = await pool
    .request()
    .input("postId", sql.Int, postId)
    .input("userId", sql.Int, userId)
    .input("text", sql.NVarChar(sql.MAX), text)
    .query(
      `INSERT INTO comments (post_id, user_id, text)
       OUTPUT INSERTED.id, INSERTED.post_id, INSERTED.user_id, INSERTED.text, INSERTED.created_at
       VALUES (@postId, @userId, @text)`,
    );

  const comment = result.recordset[0];

  const userResult = await pool
    .request()
    .input("userId", sql.Int, userId)
    .query(`SELECT first_name, last_name FROM users WHERE id = @userId`);

  const user = userResult.recordset[0];

  return mapComment(
    {
      ...comment,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    { likeCount: 0, isLiked: false, likedBy: [] },
    [],
  );
};

module.exports = {
  getCommentsByPost,
  addComment,
  postExists,
};
