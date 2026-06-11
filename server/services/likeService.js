const { sql, poolPromise } = require("../config/db");
const ApiError = require("../utils/ApiError");
const { mapAuthor } = require("../utils/feedMapper");

const VALID_TARGET_TYPES = ["post", "comment", "reply"];
const LIKED_BY_LIMIT = 10;

const assertValidTargetType = (targetType) => {
  if (!VALID_TARGET_TYPES.includes(targetType)) {
    throw new ApiError(400, "Invalid target type");
  }
};

const targetExists = async (targetType, targetId) => {
  const pool = await poolPromise;
  const tableMap = {
    post: "posts",
    comment: "comments",
    reply: "replies",
  };

  const result = await pool
    .request()
    .input("targetId", sql.Int, targetId)
    .query(`SELECT id FROM ${tableMap[targetType]} WHERE id = @targetId`);

  return Boolean(result.recordset[0]);
};

const buildIdInputs = (request, targetIds) => {
  const placeholders = targetIds.map((id, index) => {
    const param = `targetId${index}`;
    request.input(param, sql.Int, id);
    return `@${param}`;
  });

  return placeholders.join(", ");
};

const getLikeInfoForTargets = async (targetType, targetIds, currentUserId) => {
  if (!targetIds.length) {
    return {};
  }

  const pool = await poolPromise;
  const countRequest = pool.request().input("targetType", sql.NVarChar(10), targetType);
  const idList = buildIdInputs(countRequest, targetIds);

  const countResult = await countRequest.query(
    `SELECT target_id, COUNT(*) AS like_count
     FROM likes
     WHERE target_type = @targetType AND target_id IN (${idList})
     GROUP BY target_id`,
  );

  let userLikeResult = { recordset: [] };
  if (currentUserId) {
    const userLikeRequest = pool
      .request()
      .input("userId", sql.Int, currentUserId)
      .input("targetType", sql.NVarChar(10), targetType);
    const userIdList = buildIdInputs(userLikeRequest, targetIds);
    userLikeResult = await userLikeRequest.query(
      `SELECT target_id
       FROM likes
       WHERE target_type = @targetType
         AND target_id IN (${userIdList})
         AND user_id = @userId`,
    );
  }

  const likedByRequest = pool
    .request()
    .input("targetType", sql.NVarChar(10), targetType);
  const likedByIdList = buildIdInputs(likedByRequest, targetIds);
  const likedByResult = await likedByRequest.query(
    `SELECT l.target_id, u.id AS user_id, u.first_name, u.last_name
     FROM likes l
     INNER JOIN users u ON u.id = l.user_id
     WHERE l.target_type = @targetType AND l.target_id IN (${likedByIdList})
     ORDER BY l.created_at DESC`,
  );

  const infoMap = {};
  targetIds.forEach((id) => {
    infoMap[id] = { likeCount: 0, isLiked: false, likedBy: [] };
  });

  countResult.recordset.forEach((row) => {
    infoMap[row.target_id].likeCount = row.like_count;
  });

  userLikeResult.recordset.forEach((row) => {
    infoMap[row.target_id].isLiked = true;
  });

  const likedByCount = {};
  likedByResult.recordset.forEach((row) => {
    const count = likedByCount[row.target_id] || 0;
    if (count < LIKED_BY_LIMIT) {
      infoMap[row.target_id].likedBy.push(mapAuthor(row));
      likedByCount[row.target_id] = count + 1;
    }
  });

  return infoMap;
};

const getLikers = async ({ targetType, targetId, limit = 50, offset = 0 }) => {
  assertValidTargetType(targetType);

  const exists = await targetExists(targetType, targetId);
  if (!exists) {
    throw new ApiError(404, `${targetType} not found`);
  }

  const pool = await poolPromise;

  const countResult = await pool
    .request()
    .input("targetType", sql.NVarChar(10), targetType)
    .input("targetId", sql.Int, targetId)
    .query(
      `SELECT COUNT(*) AS total
       FROM likes
       WHERE target_type = @targetType AND target_id = @targetId`,
    );

  const total = countResult.recordset[0].total;

  const likersResult = await pool
    .request()
    .input("targetType", sql.NVarChar(10), targetType)
    .input("targetId", sql.Int, targetId)
    .input("offset", sql.Int, offset)
    .input("limit", sql.Int, limit)
    .query(
      `SELECT u.id AS user_id, u.first_name, u.last_name, l.created_at AS liked_at
       FROM likes l
       INNER JOIN users u ON u.id = l.user_id
       WHERE l.target_type = @targetType AND l.target_id = @targetId
       ORDER BY l.created_at DESC
       OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
    );

  return {
    likers: likersResult.recordset.map((row) => ({
      ...mapAuthor(row),
      likedAt: row.liked_at,
    })),
    total,
    limit,
    offset,
  };
};

const getLikeStatus = async ({ targetType, targetId, currentUserId }) => {
  assertValidTargetType(targetType);

  const exists = await targetExists(targetType, targetId);
  if (!exists) {
    throw new ApiError(404, `${targetType} not found`);
  }

  const infoMap = await getLikeInfoForTargets(
    targetType,
    [targetId],
    currentUserId,
  );

  return infoMap[targetId] || { likeCount: 0, isLiked: false, likedBy: [] };
};

const toggleLike = async ({ targetType, targetId, userId }) => {
  assertValidTargetType(targetType);

  const exists = await targetExists(targetType, targetId);
  if (!exists) {
    throw new ApiError(404, `${targetType} not found`);
  }

  const pool = await poolPromise;

  const existing = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("targetType", sql.NVarChar(10), targetType)
    .input("targetId", sql.Int, targetId)
    .query(
      `SELECT id FROM likes
       WHERE user_id = @userId AND target_type = @targetType AND target_id = @targetId`,
    );

  let liked;

  if (existing.recordset[0]) {
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("targetType", sql.NVarChar(10), targetType)
      .input("targetId", sql.Int, targetId)
      .query(
        `DELETE FROM likes
         WHERE user_id = @userId AND target_type = @targetType AND target_id = @targetId`,
      );
    liked = false;
  } else {
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("targetType", sql.NVarChar(10), targetType)
      .input("targetId", sql.Int, targetId)
      .query(
        `INSERT INTO likes (user_id, target_type, target_id)
         VALUES (@userId, @targetType, @targetId)`,
      );
    liked = true;
  }

  const status = await getLikeStatus({ targetType, targetId, currentUserId: userId });

  return { liked, ...status };
};

module.exports = {
  getLikeInfoForTargets,
  getLikers,
  getLikeStatus,
  toggleLike,
};
