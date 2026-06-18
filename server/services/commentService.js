const { poolPromise } = require("../config/db");
const ApiError = require("../utils/ApiError");
const { mapComment } = require("../utils/feedMapper");
const { getLikeInfoForTargets } = require("./likeService");
const replyService = require("./replyService");

const postExists = async (postId) => {
  const pool = await poolPromise;
  const result = await pool.query(`SELECT id FROM posts WHERE id = $1`, [postId]);

  return Boolean(result.rows[0]);
};

const canAccessPost = async (postId, userId) => {
  const pool = await poolPromise;
  const result = await pool.query(
    `SELECT id FROM posts
     WHERE id = $1 AND (visibility = 'public' OR user_id = $2)`,
    [postId, userId],
  );

  return Boolean(result.rows[0]);
};

const getCommentsByPost = async ({ postId, userId }) => {
  const accessible = await canAccessPost(postId, userId);
  if (!accessible) {
    throw new ApiError(404, "Post not found");
  }

  const pool = await poolPromise;

  const result = await pool.query(
    `SELECT c.id, c.post_id, c.user_id, c.text, c.created_at,
            u.first_name, u.last_name
     FROM comments c
     INNER JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId],
  );

  const comments = result.rows;
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

  const result = await pool.query(
    `INSERT INTO comments (post_id, user_id, text)
     VALUES ($1, $2, $3)
     RETURNING id, post_id, user_id, text, created_at`,
    [postId, userId, text],
  );

  const comment = result.rows[0];

  const userResult = await pool.query(
    `SELECT first_name, last_name FROM users WHERE id = $1`,
    [userId],
  );

  const user = userResult.rows[0];

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
