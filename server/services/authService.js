const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { poolPromise } = require("../config/db");
const ApiError = require("../utils/ApiError");
const { mapUserToResponse } = require("../utils/userMapper");

const SALT_ROUNDS = 12;

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const findUserByEmail = async (email) => {
  const pool = await poolPromise;
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, password, created_at
     FROM users
     WHERE email = $1`,
    [email],
  );

  return result.rows[0] || null;
};

const findUserById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, created_at
     FROM users
     WHERE id = $1`,
    [id],
  );

  return result.rows[0] || null;
};

const registerUser = async ({ firstName, lastName, email, password }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const pool = await poolPromise;

  try {
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, last_name, email, created_at`,
      [firstName, lastName, email, hashedPassword],
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    return {
      user: mapUserToResponse(user),
      token,
    };
  } catch (err) {
    if (err.code === "23505") {
      throw new ApiError(409, "Email is already registered");
    }
    throw err;
  }
};

const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user.id);

  return {
    user: mapUserToResponse(user),
    token,
  };
};

const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return mapUserToResponse(user);
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
