const express = require('express')
const routes = require('./routes')

const { getUser } = require('./_helpers')

// 確認資料庫連線
require('./models')

const app = express()
const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
}

app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.locals.user = getUser(req)
})

app.use(routes)

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
