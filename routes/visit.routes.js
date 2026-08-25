const router = require('express').Router()
const visitController = require('../controllers/visit.controller')
const validateObjectId = require('../middleware/validateObjectId')
const verifyToken = require('../middleware/verifyToken')

router.get('/', verifyToken, visitController.getAllVisits)
router.post('/', verifyToken, visitController.createVisit)
router.get('/:visitId', verifyToken,validateObjectId, visitController.getOneVisit)
module.exports = router