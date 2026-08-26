const router = require('express').Router()
const favoriteController = require('../controllers/favorite.controller')
const validateObjectId = require('../middleware/validateObjectId')
const verifyToken = require('../middleware/verifyToken')

router.get('/', verifyToken, favoriteController.getAllFavorites)
router.post('/', verifyToken, favoriteController.createFavorite)
router.get('/:favoriteId', verifyToken, validateObjectId, favoriteController.getOneFavorite)
router.delete('/:favoriteId', verifyToken, validateObjectId, favoriteController.deleteFavorite)


module.exports = router