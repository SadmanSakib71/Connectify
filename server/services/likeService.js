const { poolPromise, buildInClause } = require("../config/db");
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

  const result = await pool.query(
    `SELECT id FROM ${tableMap[targetType]} WHERE id = $1`,
    [targetId],
  );

  return Boolean(result.rows[0]);
};

const getLikeInfoForTargets = async (targetType, targetIds, currentUserId) => {
  if (!targetIds.length) {
    return {};
  }

  const pool = await poolPromise;
  const inClause = buildInClause(targetIds, 2);

  const countResult = await pool.query(
    `SELECT target_id, COUNT(*) AS like_count
     FROM likes
     WHERE target_type = $1 AND target_id IN (${inClause.placeholders})
     GROUP BY target_id`,
    [targetType, ...inClause.values],
  );

  let userLikeRows = [];
  if (currentUserId) {
    const userIdParam = inClause.nextIndex;
    const userLikeResult = await pool.query(
      `SELECT target_id
       FROM likes
       WHERE target_type = $1
         AND target_id IN (${inClause.placeholders})
         AND user_id = $${userIdParam}`,
      [targetType, ...inClause.values, currentUserId],
    );
    userLikeRows = userLikeResult.rows;
  }

  const likedByResult = await pool.query(
    `SELECT l.target_id, u.id AS user_id, u.first_name, u.last_name
     FROM likes l
     INNER JOIN users u ON u.id = l.user_id
     WHERE l.target_type = $1 AND l.target_id IN (${inClause.placeholders})
     ORDER BY l.created_at DESC`,
    [targetType, ...inClause.values],
  );

  const infoMap = {};
  targetIds.forEach((id) => {
    infoMap[id] = { likeCount: 0, isLiked: false, likedBy: [] };
  });

  countResult.rows.forEach((row) => {
    infoMap[row.target_id].likeCount = Number(row.like_count);
  });

  userLikeRows.forEach((row) => {
    infoMap[row.target_id].isLiked = true;
  });

  const likedByCount = {};
  likedByResult.rows.forEach((row) => {
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

  const countResult = await pool.query(
    `SELECT COUNT(*) AS total
     FROM likes
     WHERE target_type = $1 AND target_id = $2`,
    [targetType, targetId],
  );

  const total = Number(countResult.rows[0].total);

  const likersResult = await pool.query(
    `SELECT u.id AS user_id, u.first_name, u.last_name, l.created_at AS liked_at
     FROM likes l
     INNER JOIN users u ON u.id = l.user_id
     WHERE l.target_type = $1 AND l.target_id = $2
     ORDER BY l.created_at DESC
     OFFSET $3 LIMIT $4`,
    [targetType, targetId, offset, limit],
  );

  return {
    likers: likersResult.rows.map((row) => ({
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

  const existing = await pool.query(
    `SELECT id FROM likes
     WHERE user_id = $1 AND target_type = $2 AND target_id = $3`,
    [userId, targetType, targetId],
  );

  let liked;

  if (existing.rows[0]) {
    await pool.query(
      `DELETE FROM likes
       WHERE user_id = $1 AND target_type = $2 AND target_id = $3`,
      [userId, targetType, targetId],
    );
    liked = false;
  } else {
    await pool.query(
      `INSERT INTO likes (user_id, target_type, target_id)
       VALUES ($1, $2, $3)`,
      [userId, targetType, targetId],
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
