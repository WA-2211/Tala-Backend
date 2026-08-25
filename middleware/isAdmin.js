// middleware/isAdmin.js
function isAdmin(req, res, next){
  
    if(!req.user){
        return res.status(401).json({message: 'Unathenticated, User must login first'})
    }

    if(req.user.role !== 'admin'){
        return res.status(403).json({message: 'Unathorized, Admin access only!'})
    }
    next()
}

module.exports = isAdmin
