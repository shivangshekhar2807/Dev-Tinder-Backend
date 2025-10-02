
const express = require('express');
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const { userAuth } = require('../middlewares/auth');
const orderPaymentModel=require('../models/orderPayments');
const membershipPlan = require('../utils/constants');
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const userModel=require('../models/user')

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { membershipType } = req.body;

     const orderId = await razorpayInstance.orders.create({
       amount: membershipPlan[membershipType]*100,
       currency: "INR",
       

       notes: {
         firstName: user.firstName,
         lastName: user.lastName,
         membershipType: membershipType,
       },
     });
        
        const finalOrderId = new orderPaymentModel({
          userId: user._id,
          orderId: orderId.id, // Razorpay order ID
          amount: orderId.amount, // total amount
          amount_paid: orderId.amount_paid, // from razorpay response
          attempts: orderId.attempts, // from razorpay response
          created_at: orderId.created_at, // from razorpay response (epoch)
          currency: orderId.currency,
         
          status: orderId.status, // usually "created"
          notes: {
            firstName: orderId.notes.firstName,
            lastName: orderId.notes.lastName,
            membershipType: orderId.notes.membershipType,
          },
        });

        const savedOrderId = await finalOrderId.save();
        
        console.log("orderId", savedOrderId);

        res.json({
          data: savedOrderId,
          keyId: process.env.RAZORPAY_KEY_ID,
        });
    }
    catch (err) {
        console.log(err)
    }
})
 
paymentRouter.post('/payment/webhook', async (req, res) => {
    try {
        // const webhookSignature = req.headers["X-Razorpay-Signature"]; does the same thing
         const webhookSignature = req.get["X-Razorpay-Signature"];
       const isWebhookValid= validateWebhookSignature(
          JSON.stringify(req.body),
          webhookSignature,
          process.env.RAZORPAY_WEBHOOK_SECRET
       );
        
        if (!isWebhookValid) {
            return res.status(400).json({ERROR:"Webhook signature is invalid"})
        }

        const paymentDetails = req.body.payload.payment.entity;

        const payment = await orderPaymentModel.findOne({
          orderId: paymentDetails.order_id
        });

        payment.status = paymentDetails.status;
        await payment.save();

        const user = await userModel.findOne({ _id: payment.userid });
        
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;

        await user.save();

        // if (req.body.event == "payment.captured") {
            
        // }
        //  if (req.body.event == "payment.failed") {
        //  }

        return res.status(200).json({message:"Webhooh recieved successfully"})
    }
    catch (err) {
        return res.status(400).json({ERROR:err.emssage})
    }
})


module.exports = paymentRouter;