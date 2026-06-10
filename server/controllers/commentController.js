const commentService = require("../services/commentService");
const asyncHandler = require("../utils/asyncHandler");

const getComments = asyncHandler(async (req, res) => {
  const comments = await commentService.getCommentsByPost({
    postId: Number(req.params.postId),
    userId: req.user.userId,
  });

  res.status(200).json({
    success: true,
    data: { comments },
  });
});

const addComment = asyncHandler(async (req, res) => {
  const comment = await commentService.addComment({
    postId: Number(req.params.postId),
    userId: req.user.userId,
    text: req.body.text,
  });

  res.status(201).json({
    success: true,
    message: "Comment added",
    data: { comment },
  });
});

module.exports = { getComments, addComment };
