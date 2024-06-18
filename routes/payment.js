const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');
const {sendStripeKey, sendRazorPayKey, captureStripePayment, captureRazorPayPayment} = require('../controllers/paymentController')

router.route("/stripeKey").get(isLoggedIn,sendStripeKey)
router.route("/razorPayKey").get(isLoggedIn,sendRazorPayKey)

router.route("/capture-razorPay").post(isLoggedIn,captureRazorPayPayment)
router.route("/capture-stripePay").post(isLoggedIn,captureStripePayment)

module.exports = router;