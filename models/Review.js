const {Schema, model} = require("mongoose");

const reviewSchema = new Schema(
  {
    rating:{
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    reviewText:{
        type: String,
        trim: true,
        maxlength: 500
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



const Review = model("Review", reviewSchema);

module.exports = Review;
