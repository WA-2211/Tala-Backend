const mongoose = require('mongoose')
function validateObjectId(req,res,next){
  const {id, placeId} = req.params
  const objectId = id || placeId

if (!mongoose.Types.ObjectId.isValid(objectId)) {
      return res.status(404).json({ message: "No object matching id provided" });
    }
next()
}

module.exports = validateObjectId