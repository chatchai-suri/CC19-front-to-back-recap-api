exports.register = (req, res, next) => {
  // code
  try {
    res.json({message: "Hello, Register"})
  } catch (error) {
    console.log(error)
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