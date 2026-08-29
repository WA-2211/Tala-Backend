const router = require('express').Router({ mergeParams: true })
const reviewController = require('../controllers/review.controller')
const validateObjectId = require('../middleware/validateObjectId')
const verifyToken = require('../middleware/verifyToken')

router.get('/',  reviewController.getAllReviews)
router.post('/', verifyToken, reviewController.createReview)
router.delete('/:reviewId', verifyToken, validateObjectId, reviewController.deleteReview)
module.exports = router