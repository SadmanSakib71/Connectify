const express = require("express");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const { authenticate } = require("../middleware/authMiddleware");
const { handleUpload } = require("../middleware/uploadMiddleware");
const {
  validateCreatePost,
  validateTextContent,
} = require("../validators/feedValidator");

const router = express.Router();

router.use(authenticate);

router.get("/feed", postController.getFeed);
router.post("/", handleUpload, validateCreatePost, postController.createPost);
router.delete("/:id", postController.deletePost);

router.get("/:postId/comments", commentController.getComments);
router.post(
  "/:postId/comments",
  validateTextContent("text"),
  commentController.addComment,
);

module.exports = router;
