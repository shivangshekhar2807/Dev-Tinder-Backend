
const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    
    fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required:true
    },

    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message:`{VALUE} is incorrect status type`
        }
    },
    
},
    {
        timestamps:true
    }
)

connectionRequestSchema.index({fromUserId:1,toUserId:1})

connectionRequestSchema.pre('save', function (next) {
    const request = this;

    if (request.fromUserId.equals(request.toUserId)) {
        throw new Error("Cannot send Connection request to yourself")
    }
    next();
})


const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequestModel",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;