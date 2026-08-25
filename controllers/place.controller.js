const Place = require('../models/Place')
const User = require('../models/User')

async function getAllPlaces(req, res) {
    try {
        const allPlaces = await Place.find()
        res.status(200).json(allPlaces)

    } catch (err) {
        res.status(500).json({ message: err.message })

    }
}

async function createPlace(req, res){
    try {
        const {name, category, priceRange, description, ratingAvg, tags} = req.body
        const createdPlace = await Place.create({
            name,
            description,
            category,
            priceRange,
            ratingAvg,
            tags
    })

    res.status(201).json(createdPlace)
    }
    
    catch (err) {
            if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }
            res.status(500).json({ message: err.message })

    }
}

async function getOnePlace(req, res){
    try {
        const getPlace = await Place.findById(req.params.placeId)
        if(!getPlace){
            return res.status(404).json({message: 'Place not found!'})
        }

        res.status(200).json(getPlace)

    } catch (err) {
            res.status(500).json({ message: err.message })

    }
}

async function updatePlace(req, res){
    try {
        const {name, category, priceRange, description, ratingAvg, tags} = req.body
        const updatedPlace = await Place.findByIdAndUpdate(req.params.placeId,{
            name,
            description,
            category,
            priceRange,
            ratingAvg,
            tags
    }, {new: true})
        if(!updatedPlace){
            return res.status(404).json({message: 'Place not found!'})
        }
        res.status(200).json(updatedPlace)
    } catch (err) {
            if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })

    }
}

async function deletePlace(req, res){
    try {
        const deletedPlace = await Place.findByIdAndDelete(req.params.placeId)
        if(!deletedPlace){
            return res.status(404).json({message: 'Place not found!'})
        }
        res.status(204).json({message: 'Place has been deleted!'})

    } catch (err) {
        res.status(500).json({ message: err.message })

    }

}

module.exports = {
    getAllPlaces,
    createPlace,
    getOnePlace,
    updatePlace,
    deletePlace
}