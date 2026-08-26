const router = require('express').Router()
const planController = require('../controllers/plan.controller')
const validateObjectId = require('../middleware/validateObjectId')
const verifyToken = require('../middleware/verifyToken')

router.get('/', verifyToken, planController.getAllPlans)
router.post('/', verifyToken, planController.createPlan)

module.exports = router