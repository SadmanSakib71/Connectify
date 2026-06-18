const { poolPromise, buildInClause } = require("../config/db");
const ApiError = require("../utils/ApiError");
const { mapReply } = require("../utils/feedMapper");
const { getLikeInfoForTargets } = require("./likeService");

const commentExists = async (commentId) => {
  const pool = await poolPromise;
  const result = await pool.query(
    `SELECT id FROM comments WHERE id = $1`,
    [commentId],
  );

  return Boolean(result.rows[0]);
};

const getRepliesByCommentIds = async (commentIds, userId) => {
  if (!commentIds.length) {
    return {};
  }

  const pool = await poolPromise;
  const { placeholders, values } = buildInClause(commentIds);

  const result = await pool.query(
    `SELECT r.id, r.comment_id, r.user_id, r.text, r.created_at,
            u.first_name, u.last_name
     FROM replies r
     INNER JOIN users u ON u.id = r.user_id
     WHERE r.comment_id IN (${placeholders})
     ORDER BY r.created_at ASC`,
    values,
  );

  const replies = result.rows;
  const replyIds = replies.map((r) => r.id);
  const likeInfoMap = await getLikeInfoForTargets("reply", replyIds, userId);

  const repliesMap = {};
  commentIds.forEach((id) => {
    repliesMap[id] = [];
  });

  replies.forEach((row) => {
    repliesMap[row.comment_id].push(
      mapReply(row, likeInfoMap[row.id]),
    );
  });

  return repliesMap;
};

const getRepliesByComment = async ({ commentId, userId }) => {
  const exists = await commentExists(commentId);
  if (!exists) {
    throw new ApiError(404, "Comment not found");
  }

  const repliesMap = await getRepliesByCommentIds([commentId], userId);
  return repliesMap[commentId] || [];
};

const addReply = async ({ commentId, userId, text }) => {
  const exists = await commentExists(commentId);
  if (!exists) {
    throw new ApiError(404, "Comment not found");
  }

  const pool = await poolPromise;

  const result = await pool.query(
    `INSERT INTO replies (comment_id, user_id, text)
     VALUES ($1, $2, $3)
     RETURNING id, comment_id, user_id, text, created_at`,
    [commentId, userId, text],
  );

  const reply = result.rows[0];

  const userResult = await pool.query(
    `SELECT first_name, last_name FROM users WHERE id = $1`,
    [userId],
  );

  const user = userResult.rows[0];

  return mapReply(
    {
      ...reply,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    { likeCount: 0, isLiked: false, likedBy: [] },
  );
};

module.exports = {
  getRepliesByCommentIds,
  getRepliesByComment,
  addReply,
};
