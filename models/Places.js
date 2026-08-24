const {Schema, model} = require("mongoose");

const placesSchema = new Schema(
  {
    name: {
        type:String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    category:{
        type: String,
        required: true,
        enum: ['cafe', 'restaurant', 'event', 'cinema', 'shooping', 'bookstore', 'sports', 'activity', 'workshop', 'gallery', 'park', 'museum', 'other']
    },
    description:{
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    priceRange:{
        category:{
            type: String,
            required: true,
            enum: ['affordable', 'midrange', 'premium']
        },
        averageBHD:{
            type: Number,
            min: 0.1,
            max: 100 
        }
    },
    ratingAvg:{
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    tags:{
        type: [String],
        default: []
    }

  },
  { timestamps: true },
);


const Places = model("Places", placesSchema);

module.exports = Places;
