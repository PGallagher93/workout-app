const jwt = require('jsonwebtoken')

exports.authMiddleware = (req, res, next) => {
    
    const authHeader = req.headers.authorization
   
    
    if(!authHeader){
        return res.status(401).send({msg : "Unauthorised"})
    }
const secret = process.env.JWT_SECRET
    console.log(secret, " secret")
     jwt.verify(authHeader, secret,
        (err, decoded) => {
            if (err) return res.status(401).send({msg : "unauthorised"})
            req.user = decoded.userId
            next()
        })
    
    
    
    
}