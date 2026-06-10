const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const result = await authService.registerUser({
    firstName,
    lastName,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.userId);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

module.exports = { register, login, getMe };
