const router = require('express').Router()
const inviteController = require('../controllers/invite.controller')
const validateObjectId = require('../middleware/validateObjectId')
const verifyToken = require('../middleware/verifyToken')

router.put('/:inviteId', verifyToken, inviteController.updateInvite)
router.get('/', verifyToken, inviteController.getMyInvites)


module.exports = router