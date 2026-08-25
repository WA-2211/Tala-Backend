const Visit = require('../models/Visit')
const User = require('../models/User')
const Place = require('../models/Place')

async function getAllVisits(req, res) {
    try {
        const getMyVisits = await Visit.find({ user: req.user._id }).populate('place')
        res.status(200).json(getMyVisits)
    } catch (err) {
        res.status(500).json({ message: err.message })

    }

}

async function createVisit(req, res) {
    try {
        const { place } = req.body
        const foundPlace = await Place.findById(place)
        
        if(!foundPlace){
            return res.status(404).json({message: 'Place not found!'})
        }

        const visitedAt = new Date()
        const daysOfCoolDown = 15
        const coolDownUntil = new Date(visitedAt)
        coolDownUntil.setDate(coolDownUntil.getDate()+ daysOfCoolDown)

        const coolDown = await Visit.findOne({
            user: req.user._id,
            place,
            coolDownUntil: {$gt: visitedAt}
        })

        const options = {
            timeZone: 'Asia/Bahrain',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'

        }

        if(coolDown){
            return res.status(400).json({message: `Active cooldown on this place until ${coolDown.coolDownUntil.toLocaleString('en-BH', options)}`})
        }


        const createdVisit = await Visit.create({
            visitedAt,
            coolDownUntil,
            place,
            user: req.user._id
        })
        
        res.status(201).json(createdVisit)

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })

    }
}

async function getOneVisit(req, res){
    try {
        const getVisit = await Visit.findById(req.params.visitId).populate('place')
        if(!getVisit){
            return res.status(404).json({message: 'Visit not found!'})
        }

        if(getVisit.user.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'Unathorized, Owner access only!'})
        }
        res.status(200).json(getVisit)

    } catch (err) {
        res.status(500).json({ message: err.message })
    
    }
}

async function deleteVisit(req, res){
    try {
        const getVisit = await Visit.findById(req.params.visitId)
        if(!getVisit){
            return res.status(404).json({message: 'Visit not found!'})
        }
        if(getVisit.user.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'Unathorized, Owner access only!'})
        }

        const deletedVisit = await Visit.findByIdAndDelete(req.params.visitId)
        res.status(204).json(deletedVisit)
    } catch (err) {
        res.status(500).json({ message: err.message })

    }

}

module.exports = {
    getAllVisits,
    createVisit,
    getOneVisit,
    deleteVisit
}