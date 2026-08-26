const router = require('express').Router({ mergeParams: true })
const inviteController = require('../controllers/invite.controller')
const validateObjectId = require('../middleware/validateObjectId')
const verifyToken = require('../middleware/verifyToken')

router.post('/', verifyToken, inviteController.createInvite)
router.get('/', verifyToken, inviteController.getAllInvites)

module.exports = router