const Invite = require('../models/Invite')
const User = require('../models/User')
const Plan = require('../models/Plan')


async function createInvite(req, res) {
    try {
        const { planId } = req.params
        const { username } = req.body

        const foundPlan = await Plan.findById(planId)
        if (!foundPlan) {
            return res.status(404).json({ message: 'Plan not found!' })
        }
        if (foundPlan.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unathorized, Owner access only!' })
        }

        const user = await User.findOne({ username: username.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }

        const createdInvite = await Invite.create({
            user: user._id,
            plan: foundPlan._id

        })
        res.status(201).json(createdInvite)

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })

    }
}

async function getAllInvites(req, res) {
    try {
        const { planId } = req.params
        const foundPlan = await Plan.findById(planId)
        if (!foundPlan) {
            return res.status(404).json({ message: 'Plan not found!' })
        }
        if (foundPlan.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unathorized, Owner access only!' })
        }

        const getInvites = await Invite.find({ plan: planId }).populate('user', 'username')
        res.status(200).json(getInvites)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function updateInvite(req, res) {
    try {
        const { inviteId } = req.params
        const { status } = req.body

        const getInvite = await Invite.findById(inviteId)
        if (!getInvite) {
            return res.status(404).json({ message: 'No invite found!' })
        }
        if (getInvite.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unathorized, Owner access only!' })
        }
        const updatedInvite = await Invite.findByIdAndUpdate(inviteId, {
            status
        }, { new: true, runValidators: true })

        res.status(200).json(updatedInvite)
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })

    }
}


async function getMyInvites(req, res) {
    try {
        const getInvites = await Invite.find({ user: req.user._id }).populate({ path: 'plan', populate: { path: 'place' } })
        // if(getInvites.length === 0){
        //     return res.status(200).json({message: 'No Invites to show yet!'})
        // }
        res.status(200).json(getInvites)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function acceptInvite(req, res) {
    try {
        const { inviteLink } = req.params
        const foundPlan = await Plan.findOne({inviteLink: inviteLink})
        if (!foundPlan) {
            return res.status(404).json({ message: 'Plan not found!' })
        }

        const foundInvite = await Invite.findOne({
            user: req.user._id,
            plan: foundPlan._id
        })
        if (foundInvite) {
            return res.status(200).json({ message: 'You have joined the plan!', invite: foundInvite })
        }

        const joinInvite = await Invite.create({
            user: req.user._id,
            plan: foundPlan._id,
            status: 'accepted'
        })
        res.status(201).json(joinInvite)
    } catch (err) {
        res.status(500).json({ message: err.message })

    }
}
module.exports = {
    createInvite,
    getAllInvites,
    updateInvite,
    getMyInvites,
    acceptInvite
}