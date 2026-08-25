const {Schema, model} = require("mongoose");

const visitSchema = new Schema(
  {
    visitedAt:{
      type: Date,
    },
   coolDownUntil: {
    type: Date,
    required: true
   },
   user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
   },
   place:{
    type: Schema.Types.ObjectId,
    ref: 'Place'
   }
  },
  { timestamps: true },
);


const Visit = model("Visit", visitSchema);

module.exports = Visit;
