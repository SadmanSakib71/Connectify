const validateCreatePost = (req, res, next) => {
  const text = req.body.text;
  const visibility = req.body.visibility || "public";
  const errors = [];

  if (!text || !String(text).trim()) {
    errors.push({ field: "text", message: "Post text is required" });
  }

  if (!["public", "private"].includes(visibility)) {
    errors.push({
      field: "visibility",
      message: "Visibility must be public or private",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body.text = String(text).trim();
  req.body.visibility = visibility;

  next();
};

const validateTextContent = (fieldName) => (req, res, next) => {
  const text = req.body.text;
  const errors = [];

  if (!text || !String(text).trim()) {
    errors.push({ field: fieldName, message: "Text is required" });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body.text = String(text).trim();
  next();
};

const validateToggleLike = (req, res, next) => {
  const { targetType, targetId } = req.body;
  const errors = [];

  if (!targetType || !["post", "comment", "reply"].includes(targetType)) {
    errors.push({
      field: "targetType",
      message: "targetType must be post, comment, or reply",
    });
  }

  const parsedId = Number(targetId);
  if (!targetId || !Number.isInteger(parsedId) || parsedId <= 0) {
    errors.push({
      field: "targetId",
      message: "targetId must be a positive integer",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body.targetId = parsedId;
  next();
};

const validateLikeStatus = (req, res, next) => {
  const { targetType, targetId } = req.query;
  const errors = [];

  if (!targetType || !["post", "comment", "reply"].includes(targetType)) {
    errors.push({
      field: "targetType",
      message: "targetType must be post, comment, or reply",
    });
  }

  const parsedId = Number(targetId);
  if (!targetId || !Number.isInteger(parsedId) || parsedId <= 0) {
    errors.push({
      field: "targetId",
      message: "targetId must be a positive integer",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.query.targetId = parsedId;
  next();
};

const validateGetLikers = (req, res, next) => {
  const { targetType, targetId, limit, offset } = req.query;
  const errors = [];

  if (!targetType || !["post", "comment", "reply"].includes(targetType)) {
    errors.push({
      field: "targetType",
      message: "targetType must be post, comment, or reply",
    });
  }

  const parsedId = Number(targetId);
  if (!targetId || !Number.isInteger(parsedId) || parsedId <= 0) {
    errors.push({
      field: "targetId",
      message: "targetId must be a positive integer",
    });
  }

  const parsedLimit = limit === undefined ? 50 : Number(limit);
  if (!Number.isInteger(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100) {
    errors.push({
      field: "limit",
      message: "limit must be an integer between 1 and 100",
    });
  }

  const parsedOffset = offset === undefined ? 0 : Number(offset);
  if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
    errors.push({
      field: "offset",
      message: "offset must be a non-negative integer",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.query.targetId = parsedId;
  req.query.limit = parsedLimit;
  req.query.offset = parsedOffset;
  next();
};

module.exports = {
  validateCreatePost,
  validateTextContent,
  validateToggleLike,
  validateLikeStatus,
  validateGetLikers,
};
