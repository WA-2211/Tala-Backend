const router = require('express').Router({ mergeParams: true })
const reviewController = require('../controllers/review.controller')
const validateObjectId = require('../middleware/validateObjectId')
const verifyToken = require('../middleware/verifyToken')

router.get('/', verifyToken, reviewController.getAllReviews)
router.post('/', verifyToken, reviewController.createReview)
module.exports = router