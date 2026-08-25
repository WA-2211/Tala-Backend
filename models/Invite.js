const {Schema, model} = require("mongoose");

const inviteSchema = new Schema(
  {
    status:{
        type: String,
        enum: ['pending', 'accepted', 'not accepted'],
        default: 'pending'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan:{
        type: Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    }
  },
  { timestamps: true },
);


const Invite = model("Invite", inviteSchema);

module.exports = Invite;
