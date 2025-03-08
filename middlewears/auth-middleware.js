const createError = require("../utils/createError")
const jwt = require('jsonwebtoken')

exports.authCheck = async (req, res, next) => {
  try {
    // code
    const authorization = req.headers.authorization
    if(!authorization) {
      return createError(400, "Missing Token !!!")
    }
    // In Header use space-bar to separate between Bearer and Token
    const token = authorization.split(" ")[1]
    
    // Verify token
    jwt.verify(token,process.env.SECRET, (error, decode)=>{
      if(error) {
        return createError(401, "Unauthorized !!!")
      }
      req.user = decode
      console.log("req.user ===", req.user)
      next()
    })
  } catch (error) {
    next(error)
  }
}