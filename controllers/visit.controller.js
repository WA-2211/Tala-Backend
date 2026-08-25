const Visit = require('../models/Visit')
const User = require('../models/User')
const Place = require('../models/Place')

async function getAllVisits(req, res){
    try {
        const getMyVisits = await Visit.find({user: req.user._id}).populate('place')
        res.status(200).json(getMyVisits)
    } catch (err) {
        res.status(500).json({ message: err.message })

    }

}

module.exports = {
    getAllVisits
}