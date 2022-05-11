require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const app = express()
const { getUser } = require('./_helpers')
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})
// 將 request 導入路由器
app.use(routes)

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app
