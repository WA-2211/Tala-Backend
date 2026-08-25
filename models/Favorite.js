const {Schema, model} = require("mongoose");

const favoriteSchema = new Schema(
  {
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


const Favorite = model("Favorite", favoriteSchema);

module.exports = Favorite;
