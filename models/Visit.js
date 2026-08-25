const {Schema, model} = require("mongoose");

const visitSchema = new Schema(
  {
    visitedAt:{
      type: Date,
      required: true,
      default: Date.now
    },
   coolDownUntil: {
    type: Date,
   },
   user: {
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


const Visit = model("Visit", visitSchema);

module.exports = Visit;
