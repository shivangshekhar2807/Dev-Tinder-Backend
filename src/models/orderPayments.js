const mongoose = require('mongoose');

const orderPaymentSchema = mongoose.Schema(
    {
      
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "user",
            required:true
        },
        orderId: {
            type: String, required: true
        }, // order id
      
        paymentId: {
          type:String
      },
       
        amount: {
            type: Number, required: true
        },
       
        amount_paid: {
            type: Number, default: 0
        },
        attempts: {
            type: Number, default: 0
        },
        created_at: {
            type: Number, required: true
        },
        currency: {
            type: String, required: true, default: "INR"
        },
       
       
        status: {
            type: String, required: true
            //  enum: ["captured", "failed"], default: "created"
        },
    notes: {
      firstName: { type: String },
      lastName: { type: String },
      membershipType: { type: String, enum: ["silver", "gold"] },
    },
  },
  { timestamps: true }
);



const orderPaymentModel = new mongoose.model(
  "orderPaymentModel",
  orderPaymentSchema
);

module.exports = orderPaymentModel;