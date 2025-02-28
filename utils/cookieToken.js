const cookieToken = (user, res) => {
  console.log(user)
  const token = user.getJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  user.password = undefined
  res.status(200).cookie("token", token, options).json({
    success: true,
    token: token,
    user,
  });
};

module.exports = cookieToken;
