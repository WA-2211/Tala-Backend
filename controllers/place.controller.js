const Place = require('../models/Place')

async function getAllPlaces (req, res){
    try {
        const allPlaces = await Place.find()
        res.status(200).json(allPlaces)
        
    } catch (err) {
        res.status(500).json({message: err.message})
        
    }
}

module.exports = {
    getAllPlaces
}