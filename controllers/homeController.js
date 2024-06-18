const BigPromise = require("../middlewares/bigPromise");

exports.home = BigPromise((req, res) => {
  res.status(200).json({
    success: "true",
    greeting: "Hello Genius",
  });
});

exports.homeDummy = (req, res) => {
  try {
    res.status(200).json({
      success: "true",
      greeting: "Hello Dummy",
    });
  } catch (error) {
    console.log(error);
  }
};
