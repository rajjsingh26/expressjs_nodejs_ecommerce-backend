const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');
const { createOrder, getOneOrder, getLoggedInOrder } = require('../controllers/orderController');

router.route("/order/create").post(isLoggedIn,createOrder)
router.route("/order/:id").get(isLoggedIn,getOneOrder)
router.route("/myorder").get(isLoggedIn,getLoggedInOrder)

module.exports = router;