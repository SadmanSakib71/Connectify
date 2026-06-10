const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("../config/db");
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
  const result = await pool
    .request()
    .input("email", sql.NVarChar(255), email)
    .query(
      `SELECT id, first_name, last_name, email, password, created_at
       FROM users
       WHERE email = @email`,
    );

  return result.recordset[0] || null;
};

const findUserById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(
      `SELECT id, first_name, last_name, email, created_at
       FROM users
       WHERE id = @id`,
    );

  return result.recordset[0] || null;
};

const registerUser = async ({ firstName, lastName, email, password }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const pool = await poolPromise;

  try {
    const result = await pool
      .request()
      .input("firstName", sql.NVarChar(100), firstName)
      .input("lastName", sql.NVarChar(100), lastName)
      .input("email", sql.NVarChar(255), email)
      .input("password", sql.NVarChar(255), hashedPassword)
      .query(
        `INSERT INTO users (first_name, last_name, email, password)
         OUTPUT INSERTED.id, INSERTED.first_name, INSERTED.last_name,
                INSERTED.email, INSERTED.created_at
         VALUES (@firstName, @lastName, @email, @password)`,
      );

    const user = result.recordset[0];
    const token = generateToken(user.id);

    return {
      user: mapUserToResponse(user),
      token,
    };
  } catch (err) {
    if (err.number === 2627 || err.number === 2601) {
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
