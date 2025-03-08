const handleError = (err, req, res, next) => {
  console.log("Step 3 Handle Error")
  res
    .status(err.statusCode || 500)
    .json({message: err.message || "Somthing wrong from server!!"})

}

module.exports = handleError