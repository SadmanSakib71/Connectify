const postService = require("../services/postService");
const asyncHandler = require("../utils/asyncHandler");

const getFeed = asyncHandler(async (req, res) => {
  const posts = await postService.getFeedPosts(req.user.userId);

  res.status(200).json({
    success: true,
    data: { posts },
  });
});

const createPost = asyncHandler(async (req, res) => {
  const { text, visibility } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const post = await postService.createPost({
    userId: req.user.userId,
    text,
    imageUrl,
    visibility,
  });

  res.status(201).json({
    success: true,
    message: "Post created",
    data: { post },
  });
});

const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost({
    postId: Number(req.params.id),
    userId: req.user.userId,
  });

  res.status(200).json({
    success: true,
    message: "Post deleted",
  });
});

module.exports = { getFeed, createPost, deletePost };
