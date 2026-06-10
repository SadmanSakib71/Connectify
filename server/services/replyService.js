const { sql, poolPromise } = require("../config/db");
const ApiError = require("../utils/ApiError");
const { mapReply } = require("../utils/feedMapper");
const { getLikeInfoForTargets } = require("./likeService");

const commentExists = async (commentId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("commentId", sql.Int, commentId)
    .query(`SELECT id FROM comments WHERE id = @commentId`);

  return Boolean(result.recordset[0]);
};

const buildIdInputs = (request, commentIds) => {
  const placeholders = commentIds.map((id, index) => {
    const param = `commentId${index}`;
    request.input(param, sql.Int, id);
    return `@${param}`;
  });

  return placeholders.join(", ");
};

const getRepliesByCommentIds = async (commentIds, userId) => {
  if (!commentIds.length) {
    return {};
  }

  const pool = await poolPromise;
  const request = pool.request();
  const idList = buildIdInputs(request, commentIds);

  const result = await request.query(
    `SELECT r.id, r.comment_id, r.user_id, r.text, r.created_at,
            u.first_name, u.last_name
     FROM replies r
     INNER JOIN users u ON u.id = r.user_id
     WHERE r.comment_id IN (${idList})
     ORDER BY r.created_at ASC`,
  );

  const replies = result.recordset;
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

  const result = await pool
    .request()
    .input("commentId", sql.Int, commentId)
    .input("userId", sql.Int, userId)
    .input("text", sql.NVarChar(sql.MAX), text)
    .query(
      `INSERT INTO replies (comment_id, user_id, text)
       OUTPUT INSERTED.id, INSERTED.comment_id, INSERTED.user_id, INSERTED.text, INSERTED.created_at
       VALUES (@commentId, @userId, @text)`,
    );

  const reply = result.recordset[0];

  const userResult = await pool
    .request()
    .input("userId", sql.Int, userId)
    .query(`SELECT first_name, last_name FROM users WHERE id = @userId`);

  const user = userResult.recordset[0];

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
