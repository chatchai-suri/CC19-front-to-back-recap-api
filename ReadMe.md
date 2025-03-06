# Server

## Step 1 create package
```bash
npm init -y
```
### Step 2 install package
```
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod prisma
```
### Step 3 npx prisma init to obtain file .gitignore, .env and folder prisma 
```bash
npx prisma init
```
### Step 4 push to github
create repo at gitgub.com
```bash
git init
git add .
git commmit -m "message"
git remote add origin https://github.com/chatchai-suri/CC19-front-to-back-recap-api.git
git branch -M main
git push -u origin main
```
when update code
```bash
git add .
git commit -m "message"
git push
```
### Step 5 update package.json and index.js
package.json
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
  ```
and index.js
```js
const express =  require('express')


const app = express()


// Start Server
const PORT = 8000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
```
### Step 6 index.js: import and use middlewares
```js
const express =  require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

// Middlewares
app.use(cors())  // Allows cross domain
app.use(morgan("dev")) // Show log terminal
app.use(express.json) // For read json

// Routing


// Start Server
const PORT = 8000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
```
### Step 7 Routing and Controller [Register] without logic
/controllers/authcontroller.js
```js
exports.register = (req, res, next) => {
  // code
  try {
    res.json({message: "Hello, Register"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Server Error!!"})
  }
}
```
/routes/auth-route.js
```js
const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/auth-controller')

// @ENDPOINT http://localhost:8000/api/register
router.post('/register', authControllers.register)

// export
module.exports = router
```
index.js : import Routing and use Routing
```js
const express =  require('express')
const cors = require('cors')
const morgan = require('morgan')
// Import Routing
const authRouter = require('./routes/auth-route')

const app = express()

// Middlewares
app.use(cors())  // Allows cross domain
app.use(morgan("dev")) // Show log terminal
app.use(express.json()) // For read json

// Routing
app.use("/api", authRouter)

// Start Server
const PORT = 8000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
```
### Step 8 Routing and Controller [Login] without logic
/controllers/auth-controller.js
```js
exports.login = (req, res, next) => {
  // code
  try {
    res.json({message: "Hello, Login"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Server Error!!"})
  }
}
```
/routes/auth-route.js
```js
const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/auth-controller')

// @ENDPOINT http://localhost:8000/api/register
router.post('/register', authControllers.register)
router.post('/login', authControllers.login)


// export
module.exports = router
```
*** no need to do anything at index.js
### Step 9 Create handle Error
/middlewares/error.js
```js
const handleError = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({message: err.message || "Somthing wrong from server!!"})

}

module.exports = handleError
```

and use in index.js, just before //start server
```js
// Routing
app.use("/api", authRouter)

// Handle errors
app.use(handleErrors)

// Start Server
const PORT = 8000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
```

and at each controller e.g. exports.login and next(error at last statement)
```js
exports.login = (req, res, next) => {
  // code
  try {
    console.log(qwerty)
    res.json({message: "Hello, Login"})
  } catch (error) {
    console.log(error)
    next(error)
  }
}
```
