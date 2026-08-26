const Plan = require('../models/Plan')
const User = require('../models/User')
const Place = require('../models/Place')
const crypto = require('crypto')

async function getAllPlans(req, res) {
    try {
        const getMyPlans = await Plan.find({ user: req.user._id }).populate('place')
        if (getMyPlans.length === 0) {
            return res.status(200).json({ message: 'No plans found!' })
        }
        res.status(200).json(getMyPlans)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

}


async function createPlan(req, res) {
    try {
        const { place, scheduledDate } = req.body
        const foundPlace = await Place.findById(place)
        if (!foundPlace) {
            return res.status(404).json({ message: 'Place not found!' })
        }

        const inviteLink = crypto.randomBytes(32).toString('base64url')
        const createdPlan = await Plan.create({
            user: req.user._id,
            scheduledDate,
            inviteLink,
            place
        })
        res.status(201).json(createdPlan)
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })
    }
}

async function getPLanByLink(req, res) {
    try {
        const getPlan = await Plan.findOne({ inviteLink: req.params.inviteLink }).populate('place')
        if (!getPlan) {
            return res.status(404).json({ message: 'Plan not found!' })
        }
        res.status(200).json(getPlan)

    } catch (err) {
        res.status(500).json({ message: err.message })

    }
}

async function getOnePlan(req, res) {
    try {
        const getPlan = await Plan.findById(req.params.planId).populate('place')
        if (!getPlan) {
            return res.status(404).json({ message: 'Plan not found!' })
        }
        if (getPlan.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unathorized, Owner access only!' })
        }
        res.status(200).json(getPlan)
    } catch (err) {
        res.status(500).json({ message: err.message })

    }
}

async function updatePlan(req, res){
    try {
        const { scheduledDate, place} = req.body
        const getPlan = await Plan.findById(req.params.planId)
        if(!getPlan){
            return res.status(404).json({message: 'Plan not found!'})
        }
        if(getPlan.user.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'Unathorized, Owner access only!'})
        } 
        
        const updatedPlan = await Plan.findByIdAndUpdate(req.params.planId, {
            scheduledDate,
            place
        }, {new:true})
        res.status(200).json(updatedPlan)

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }        
        res.status(500).json({ message: err.message })

    }
}

async function deletePlan(req, res){
    try {
       const getPlan = await Plan.findById(req.params.planId)
        if(!getPlan){
            return res.status(404).json({message: 'Plan not found!'})
        }
        if(getPlan.user.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'Unathorized, Owner access only!'})
        } 
        
        const deletedPlan = await Plan.findByIdAndDelete(req.params.planId)
        res.status(204).json(deletedPlan)

       } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }        
        res.status(500).json({ message: err.message })        
    }
}

module.exports = {
    getAllPlans,
    createPlan,
    getPLanByLink,
    getOnePlan,
    updatePlan,
    deletePlan
}