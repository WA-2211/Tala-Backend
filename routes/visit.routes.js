const router = require('express').Router()
const visitController = require('../controllers/visit.controller')
const verifyToken = require('../middleware/verifyToken')

router.get('/', verifyToken, visitController.getAllVisits)

module.exports = router