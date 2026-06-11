const likeService = require("../services/likeService");
const asyncHandler = require("../utils/asyncHandler");

const toggleLike = asyncHandler(async (req, res) => {
  const result = await likeService.toggleLike({
    targetType: req.body.targetType,
    targetId: req.body.targetId,
    userId: req.user.userId,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

const getLikers = asyncHandler(async (req, res) => {
  const result = await likeService.getLikers({
    targetType: req.query.targetType,
    targetId: req.query.targetId,
    limit: req.query.limit,
    offset: req.query.offset,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

const getLikeStatus = asyncHandler(async (req, res) => {
  const result = await likeService.getLikeStatus({
    targetType: req.query.targetType,
    targetId: req.query.targetId,
    currentUserId: req.user.userId,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = { toggleLike, getLikers, getLikeStatus };
