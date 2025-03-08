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