const {Schema, model} = require("mongoose");

const reviewSchema = new Schema(
  {
    rating:{
        type: Number,
        min: 0,
        max: 5
    },
    reviewText:{
        type: String,
        trim: true,
        maxlength: 100
    },
    user:{
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



const Review = model("Review", reviewSchema);

module.exports = Review;
