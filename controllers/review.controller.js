const Review = require('../models/Review')
const User = require('../models/User')
const Place = require('../models/Place')

async function getAllReviews(req, res){
    try {
        const {placeId} = req.params
        const getReviews = await Review.find({place: placeId}).populate('user', 'username')
        if(getReviews.length === 0){
            return res.status(200).json({message: 'No reviews found!'})
        }

        res.status(200).json(getReviews)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function createReview(req, res){
    try {
        const {place, rating, reviewText} = req.body
        if(rating > 5 || rating < 1){
            return res.status(400).json({message: 'Rating must be between 1 - 5!'})
        }
                const foundPlace = await Place.findById(place)
                  if(!foundPlace){
                    return res.status(404).json({message: 'Place not found!'})
                }
                
        const createdReview = await Review.create({
            user: req.user._id,
            rating,
            reviewText,
            place
        })

        const recalculateRating = await Review.aggregate([
            {$match:{place: foundPlace._id}},
            {$group: {_id: '$place', ratingAvg:{$avg: '$rating'} }}
        ])

        let updatedAvg 
        if(recalculateRating.length > 0){
            updatedAvg = recalculateRating[0].ratingAvg
        }
         else{
            updatedAvg = 0
         }

         await Place.findByIdAndUpdate(foundPlace._id, {ratingAvg: updatedAvg})
        res.status(201).json(createdReview)
        
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })
    }
}

async function deleteReview(req, res){
    try {
        const {reviewId} = req.params
        const foundReview = await Review.findById(reviewId)
        if(!foundReview){
            return res.status(404).json({message: 'Review not found!'})
        }
        if(foundReview.user.toString() !== req.user._id.toString()){
                return res.status(403).json({message: 'Unathorized, Owner access only!'})
        }
    
        const deletedReview = await Review.findByIdAndDelete(reviewId)
        res.status(204).json(deleteReview)
    } catch (err) {
        res.status(500).json({ message: err.message })

    }
}

module.exports = {
    getAllReviews,
    createReview,
    deleteReview
}