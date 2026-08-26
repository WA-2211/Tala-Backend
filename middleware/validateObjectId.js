const mongoose = require('mongoose')
function validateObjectId(req,res,next){
  const {id, placeId,  visitId, favoriteId, reviewId, planId} = req.params
  const objectId = id || placeId || visitId || favoriteId || reviewId || planId

if (!mongoose.Types.ObjectId.isValid(objectId)) {
      return res.status(404).json({ message: "No object matching id provided" });
    }
next()
}

module.exports = validateObjectId