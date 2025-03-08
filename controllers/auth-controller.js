const prisma = require('../configs/prisma')
const createError = require("../utils/createError")
const bcrypt = require("bcryptjs")

exports.register =  async (req, res, next) => {
  try {
    // code
    // step 1 req.body
    const{email, firstname, lastname, password, confirmPassword} = req.body
    console.log(req.body)
    // step 2 validate -> switch to use validateWithZod from middleware
    // if(!email) {
    //   return createError(400, "Email is required")
    // }
    // if(!firstname) {
    //   return createError(400, "Firstname is required")
    // }
    // step 3 check already exist
    const checkEmail = await prisma.profile.findFirst({
      where: {
        email: email
      }
    })
    if(checkEmail) {
      return createError(400, "Email is already exist!!!")
    }
    // step 4 Encrypt bcrypt
    const salt = bcrypt.genSaltSync(10)
    console.log("salt====", salt)
    const hashedPassword = bcrypt.hashSync(password, salt)
    console.log("hashedPassword====", hashedPassword)
    // step 5 insert to DB
    const profile = await prisma.profile.create({
      data: {
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: hashedPassword
      }
    })
    // step 6 Response
    res.json({message: "Register success"})
  } catch (error) {
    console.log("Step 2 Catch")
    next(error)
  }
}

exports.login = (req, res, next) => {
  // code
  try {
    res.json({message: "Hello, Login"})
  } catch (error) {
    console.log(error)
    next(error)
  }
}