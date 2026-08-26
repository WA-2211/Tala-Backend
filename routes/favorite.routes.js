const router = require('express').Router()
const favoriteController = require('../controllers/favorite.controller')
const validateObjectId = require('../middleware/validateObjectId')
const verifyToken = require('../middleware/verifyToken')

router.get('/', verifyToken, favoriteController.getAllFavorites )

module.exports = router