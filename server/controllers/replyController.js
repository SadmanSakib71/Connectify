const replyService = require("../services/replyService");
const asyncHandler = require("../utils/asyncHandler");

const getReplies = asyncHandler(async (req, res) => {
  const replies = await replyService.getRepliesByComment({
    commentId: Number(req.params.commentId),
    userId: req.user.userId,
  });

  res.status(200).json({
    success: true,
    data: { replies },
  });
});

const addReply = asyncHandler(async (req, res) => {
  const reply = await replyService.addReply({
    commentId: Number(req.params.commentId),
    userId: req.user.userId,
    text: req.body.text,
  });

  res.status(201).json({
    success: true,
    message: "Reply added",
    data: { reply },
  });
});

module.exports = { getReplies, addReply };
