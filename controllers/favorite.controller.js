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
module.exports = {
    getAllFavorites
}