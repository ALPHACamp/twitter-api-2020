require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const app = express()
const port = 3000

<<<<<<< HEAD
=======
// use helpers.getUser(req) to replace req.user
//function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
//};

>>>>>>> b6e0cec21781317eab61d0ba9685c631f6fd90e0
app.use(express.urlencoded({ extended: true }))

// 將 request 導入路由器
app.use(routes)

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app
