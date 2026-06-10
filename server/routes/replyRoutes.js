const express = require("express");
const replyController = require("../controllers/replyController");
const { authenticate } = require("../middleware/authMiddleware");
const { validateTextContent } = require("../validators/feedValidator");

const router = express.Router();

router.use(authenticate);

router.get("/:commentId/replies", replyController.getReplies);
router.post(
  "/:commentId/replies",
  validateTextContent("text"),
  replyController.addReply,
);

module.exports = router;
