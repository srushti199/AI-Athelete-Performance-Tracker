const prisma = require("../../prismaClient");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const signToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, res, statusCode) => {
  const token = signToken(user.id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signup = catchAsync(async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return next(new AppError("Please provide all required fields", 400));
  }

  const existingUser = await prisma.User.findFirst({
    where: { email },
  });

  if (existingUser) {
    return next(new AppError("User with this email or username already exists", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.User.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });

  createSendToken(user, res, 201);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await prisma.User.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  createSendToken(user, res, 200);
});

// Log out by clearing the authentication cookie.
const logout = catchAsync(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

module.exports = { signup, login, logout };
