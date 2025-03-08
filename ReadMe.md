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
### Step 10 validator with zod
/middlewears/validators.js
```js
const { z } = require("zod");
// Test validator
exports.registerSchema = z
  .object({
    email: z.string().email("invalid email"),
    firstname: z.string().min(3, "Firstname at least 3 charecters"),
    lastname: z.string().min(3, "Lastname at least 3 charecters"),
    password: z.string().min(6, "Password at least 6 charecters"),
    confirmPassword: z.string().min(6, "Password at least 6 charecters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password is not match",
    path: ["confirmPassword"],
  });

exports.loginSchema = z
  .object({
    email: z.string().email("invalid email"),
    password: z.string().min(6, "Password at least 6 charecters"),
  })

exports.validateWithZod = (schema) => (req, res, next) => {
  try {
    console.log("Hello middleware");
    schema.parse(req.body);
    next();
  } catch (error) {
    const errMsg = error.errors.map((item) => item.message);
    const errTxt = errMsg.join(",");
    const mergeError = new Error(errTxt);
    next(mergeError);
  }
};
```
/routes/auth-route.js update by add zod into middleware
```js
const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const { validateWithZod, registerSchema, loginSchema } = require('../middlewears/validators')


// @ENDPOINT http://localhost:8000/api/register
router.post("/register", validateWithZod(registerSchema), authControllers.register);
router.post("/login", validateWithZod(loginSchema), authControllers.login);

// export
module.exports = router;
```
### Step 11 Prisma there are 2 files related
1. /prisma/schema.prisma
create initial DB table name profile
change datasource db, provider = "mysql"

```plaintext
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Profile {
  id Int  @id @default(autoincrement())
  email String
  firstname String
  lastname String
  role  Role @default(USER)
  password String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

}

enum Role {
  USER
  ADMIN
}
```
upload schema to DB: MySQL
```bash
npx prisma db push
#or
npx prisma migrate dev --name init 
```
2. /config/prisma.js
```js
const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = prisma
```
### Step 12 update register /controllers/auth-controller.js
/controllers/auth-controller.js
```js
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
```
### Step 13 login
/controllers/auth-controller.js [login]
```js
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
```
### Step 14 Current-user
/controllers/auth-controller.js
```js
exports.currentUser = async (req, res, next) => {
  try {
    res.json({message: "Hello, current user"})
  } catch (error) {
    next(error)
  }
}
```
update code in
/routes/auth-routes.js
```js
const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const { validateWithZod, registerSchema, loginSchema } = require('../middlewears/validators')


// @ENDPOINT http://localhost:8000/api/register
router.post("/register", validateWithZod(registerSchema), authControllers.register);
router.post("/login", validateWithZod(loginSchema), authControllers.login);
router.get("/current-user", authControllers.currentUser)

// export
module.exports = router;
```
### Step 15 User controller & Routes without logic
/controller/user-controller.js
```js
// 1. List all users
// 2. Update Role
// 3. Delete User

exports.listUsers = async (req, res, next) => {
  try {
    res.json({message: "Hello, List users"})
  } catch (error) {
    next (error)
  }
}

exports.updateRole = async (req, res, next) => {
  try {
    res.json({message: "Hello, Update Role"})
  } catch (error) {
    next (error)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    res.json({message: "Hello, Delete User"})
  } catch (error) {
    console.log(error)
  }
}
```
/routes/user-route.js
```js
const express = require("express")
const router = express.Router()
// Import controller
const userController = require('../controllers/user-controller')

//@ENDPOINT http://localhost:8000/api/users
router.get('/users', userController.listUsers)
router.patch('/user/update-role', userController.updateRole)
router.delete('/user/:id', userController.deleteUser)

module.exports = router
```
update index.js
```js
const express =  require('express')
const cors = require('cors')
const morgan = require('morgan')
const handleErrors = require('./middlewears/error')
// Import Routing
const authRouter = require('./routes/auth-route')
const userRouter = require('./routes/user-route')

const app = express()

// Middlewares
app.use(cors())  // Allows cross domain
app.use(morgan("dev")) // Show log terminal
app.use(express.json()) // For read json

// Routing
app.use("/api", authRouter)
app.use("/api", userRouter)

// Handle errors
app.use(handleErrors)

// Start Server
const PORT = 8000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
```
### Step 16 Update user-controller
/controllers/user-controller.js [listUsers], [updateRole], [deleteUser]
```js
const prisma = require("../configs/prisma")

// 1. List all users
// 2. Update Role
// 3. Delete User

exports.listUsers = async (req, res, next) => {
  try {
    console.log(req.user)
    const users = await prisma.profile.findMany({
      // select:{
      //   id: true,
      //   email: true,
      //   firstname: true,
      //   lastname: true,
      //   role: true,
      //   createdAt: true,
      //   updatedAt: true
      // }
      omit: {
        password: true,
      }
    })
    console.log("users === ", users)
    res.json({message: "Hello, List users", result: users})
  } catch (error) {
    next (error)
  }
}

exports.updateRole = async (req, res, next) => {
  try {
    const {id, role} = req.body
    console.log("id, role ====", id, role)
    const updated = await prisma.profile.update({
      where: {
        id: Number(id)
      },
      data: {
        role: role
      }
    }) 
    console.log("updated === ", updated)
    res.json({message: "Update success"})
  } catch (error) {
    next (error)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const deleted = await prisma.profile.delete({
      where: {
        id: Number(id)
      }
    })
    console.log(id)
    res.json({message: "Delete success"})
  } catch (error) {
    console.log(error)
  }
}
```
