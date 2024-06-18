const BigPromise = require("../middlewares/bigPromise");
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const RazorPay = require('razorpay');

exports.sendStripeKey = BigPromise(async (req,res,next) =>{
    res.status(200).json({
        stripeKey: process.env.STRIPE_API_KEY
    })
})

exports.sendRazorPayKey = BigPromise(async (req,res,next) =>{
    res.status(200).json({
        stripeKey: process.env.RAZORPAY_API_KEY
    })
})


exports.captureStripePayment = BigPromise(async (req,res,next) =>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',

        // optional
        metadata: {integration_check: 'accept_a_payment'}
    });

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
        // optionally send id as well
    })
})

exports.captureRazorPayPayment = BigPromise(async (req,res,next) =>{
    var instance = new RazorPay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZERPAY_SECRET
    })

    var options = {
        amount: 50000,
        currency: 'INR',
        receipt: "order_rcptid_11"
    }

    const myOrder = await instance.orders.create(options)

    res.status(200).json({
        success: true,
        amount: req.body.amount,
        order: myOrder
    })
})