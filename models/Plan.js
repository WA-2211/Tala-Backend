const {Schema, model} = require("mongoose");

const planSchema = new Schema(
  {
    status:{
        type: String,
        enum:['scheduled', 'completed', 'cancelled'],
        default:'scheduled'
    },
    scheduledDate:{
        type: Date,
        required: true
    },
    inviteLink:{
        type: String
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    place:{
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    }
  },
  { timestamps: true },
);


const Plan = model("Plan", planSchema);

module.exports = Plan;
