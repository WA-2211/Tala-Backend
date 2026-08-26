const Plan = require('../models/Plan')
const User = require('../models/User')
const Place = require('../models/Place')

async function getAllPlans(req, res) {
    try {
        const getMyPlans = await Plan.find({ user: req.user._id }).populate('place')
        if(getMyPlans.length === 0){
            return res.status(200).json({message: 'No plans found!'})
        }
        res.status(200).json(getMyPlans)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

}

module.exports = {
    getAllPlans
}