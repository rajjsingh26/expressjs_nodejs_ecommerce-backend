const BigPromise = require("../middlewares/bigPromise");
const Order = require('../models/order')
const CustomError = require("../utils/customError.js");


exports.createOrder = BigPromise(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo,
        taxAmount, shippingAmount, totalAmount } = req.body;

    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo,
        taxAmount, shippingAmount, totalAmount,
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
})

exports.getOneOrder = BigPromise(async (req, res, next) => {
    const orderId = await Order.findById(req.params.id).populate('user', 'name email')

    if (!orderId) {
        return next(new CustomError('please check order id', 401))
    }

    res.status(200).json({
        success: true,
        orderId
    })
})

exports.getLoggedInOrder = BigPromise(async (req, res, next) => {
    const order = await Order.find({ user: req.user._id });

    if (!order) {
        return next(new CustomError('please check order id', 401))
    }

    res.status(200).json({
        success: true,
        order
    })
})