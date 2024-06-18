const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError.js");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token = req.cookies.token || req.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new CustomError("Login first to access this page", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
});

exports.customRole = (...roles) =>{
  return (req, res, next) =>{
    if(!roles.includes(req.user.role)){
      return next(new CustomError("You are not authorized for this resource."), 402)
    }
    next();
  }
}
