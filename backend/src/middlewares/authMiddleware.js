const jwt = require("jsonwebtoken");
const prisma = require("../../prismaClient");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

exports.protect = catchAsync(async (req, res, next) => {
  //Get the token from req header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in please login to get access", 401));
  }

  //Decode jwt token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // check if user exists
  const user = await prisma.User.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    return next(new AppError("The user belonging to this token does no longer exists", 401));
  }

  //Grant access to protected route
  req.user = user;
  next();
});
