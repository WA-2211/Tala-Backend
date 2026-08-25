const router = require('express').Router()
const placeController = require('../controllers/place.controller')

const verifyToken = require('../middleware/verifyToken')
const validateObjectId = require('../middleware/validateObjectId')
const isAdmin = require('../middleware/isAdmin')

router.get('/', placeController.getAllPlaces)
router.get('/:placeId',validateObjectId,  placeController.getOnePlace)
router.post('/', verifyToken, isAdmin, placeController.createPlace)
router.put('/:placeId', verifyToken,validateObjectId, isAdmin, placeController.updatePlace)
router.delete('/:placeId', verifyToken,validateObjectId, isAdmin, placeController.deletePlace)

module.exports = router