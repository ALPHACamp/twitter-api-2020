const userController = {
  getUser: (req, res, next) => {
    res.send('hello world users!') // this is for route testing
  }
}

module.exports = userController
