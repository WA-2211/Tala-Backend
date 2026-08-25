const router = require('express').Router()
const placeController = require('../controllers/place.controller')

const verifyToken = require('../middleware/verifyToken')
const validateObjectId = require('../middleware/validateObjectId')

router.get('/', verifyToken, placeController.getAllPlaces)

module.exports = router