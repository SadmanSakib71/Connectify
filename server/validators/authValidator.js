const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const validateRegister = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const errors = [];

  if (!firstName || !String(firstName).trim()) {
    errors.push({ field: "firstName", message: "First name is required" });
  }

  if (!lastName || !String(lastName).trim()) {
    errors.push({ field: "lastName", message: "Last name is required" });
  }

  if (!email || !String(email).trim()) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!EMAIL_REGEX.test(String(email).trim())) {
    errors.push({ field: "email", message: "Email must be a valid email address" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  } else if (String(password).length < MIN_PASSWORD_LENGTH) {
    errors.push({
      field: "password",
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body.firstName = String(firstName).trim();
  req.body.lastName = String(lastName).trim();
  req.body.email = String(email).trim().toLowerCase();

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !String(email).trim()) {
    errors.push({ field: "email", message: "Email is required" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body.email = String(email).trim().toLowerCase();

  next();
};

module.exports = { validateRegister, validateLogin };
