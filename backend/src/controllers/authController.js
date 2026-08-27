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

  // Validate required fields
  if (!email || !password || !firstName || !lastName) {
    return next(new AppError("Please provide  all required fields", 400));
  }

  //check if user already exist
  const existingUser = await prisma.User.findFirst({
    where: {
      email,
    },
  });
  if (existingUser) {
    return next(new AppError("User with this email or username already exists", 409));
  }

  //Hash password
  const HashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.User.create({
    data: {
      email,
      password: HashedPassword,
      firstName,
      lastName,
      role: "ATHLETE",
    },
  });

  createSendToken(user, res, 201);
});

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await prisma.User.findUnique({
    where: {
      email: email,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  createSendToken(user, res, 200);
};

module.exports = { signup, login };
