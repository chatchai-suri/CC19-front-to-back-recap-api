const prisma = require('../configs/prisma')
const createError = require("../utils/createError")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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

exports.login = async (req, res, next) => {
  // code
  try {
    // Step 1 req.body
    const {email, password} = req.body
    // Step 2 check email and password
    const profile = await prisma.profile.findFirst({
      where: {
        email: email
      }
    })
    if(!profile) {
      return createError(400, "Email or Password is invalid!!!")
    }
    const isMatch = await bcrypt.compareSync(password, profile.password)
    console.log("isMatch ====", isMatch)
    if(!isMatch) {
      return createError(400, "Email or Password is invalid!!!")
    }
    // Step 3 Generate token
    const payload = {
      id: profile.id,
      email: profile.email,
      firstname: profile.firstname,
      lastname: profile.lastname,
      role: profile.role
    }
    
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "15d"
    })
    console.log("token ==== ", token)
    // step 4 Response
    res.json({
      message: "Hello, Login",
      payload: payload,
      token: token
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

exports.currentUser = async (req, res, next) => {
  try {
    res.json({message: "Hello, current user"})
  } catch (error) {
    next(error)
  }
}