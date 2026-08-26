const User = require('../models/User')
const Favorite = require('../models/Favorite')
const Place = require('../models/Place')


async function getAllFavorites(req, res) {
    try {
        const getFavorites = await Favorite.find({ user: req.user._id }).populate('place')
        if(getFavorites.length === 0){
            return res.status(200).json({message: 'No favorites found!', })
        }
        res.status(200).json(getFavorites)
    } catch (err) {
        res.status(500).json({ message: err.message })

    }

}

async function createFavorite(req, res){
    try {
        const {place} = req.body
        const foundPlace = await Place.findById(place)
          if(!foundPlace){
            return res.status(404).json({message: 'Place not found!'})
        }
        
        const addToFavorite = await Favorite.create({
            place,
            user: req.user._id
        })

        res.status(201).json(addToFavorite)
    } catch (err) {
            if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })

    }
}


module.exports = {
    getAllFavorites,
    createFavorite
}