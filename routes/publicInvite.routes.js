const router = require('express').Router({ mergeParams: true })
const inviteController = require('../controllers/invite.controller')
const validateObjectId = require('../middleware/validateObjectId')
const verifyToken = require('../middleware/verifyToken')

router.put('/:inviteId', verifyToken, inviteController.updateInvite)

module.exports = router