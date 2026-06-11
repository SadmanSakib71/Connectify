const express = require("express");
const likeController = require("../controllers/likeController");
const { authenticate } = require("../middleware/authMiddleware");
const {
  validateToggleLike,
  validateLikeStatus,
  validateGetLikers,
} = require("../validators/feedValidator");

const router = express.Router();

router.use(authenticate);

router.post("/toggle", validateToggleLike, likeController.toggleLike);
router.get("/likers", validateGetLikers, likeController.getLikers);
router.get("/", validateLikeStatus, likeController.getLikeStatus);

module.exports = router;
