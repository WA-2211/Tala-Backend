const router = require('express').Router()
const planController = require('../controllers/plan.controller')
const validateObjectId = require('../middleware/validateObjectId')
const verifyToken = require('../middleware/verifyToken')

router.get('/', verifyToken, planController.getAllPlans)
router.post('/', verifyToken, planController.createPlan)
router.get('/invite/:inviteLink', planController.getPLanByLink)
router.get('/:planId', verifyToken, validateObjectId, planController.getOnePlan)
router.put('/:planId', verifyToken, validateObjectId, planController.updatePlan)
router.delete('/:planId', verifyToken, validateObjectId, planController.deletePlan)

module.exports = router