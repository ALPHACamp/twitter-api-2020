const userDummy = require('./dummy/users-dummy.json')

const userController = {
  getUsers: (req, res, next) => {
    console.log('users_getUsers')
    res.json(userDummy.getUsers)
  },
  getUser: (req, res, next) => {
    console.log('users_getUser')
    res.json(userDummy.getUser)
  },
  getTopUsers: (req, res, next) => {
    console.log('users_getTopUser')
    res.json(userDummy.getTopUsers)
  }
}

module.exports = userController
