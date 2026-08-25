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

favoriteSchema.index({user: 1, place: 1}, {unique: true})//avoid favorite same place more than one time
const Favorite = model("Favorite", favoriteSchema);

module.exports = Favorite;
