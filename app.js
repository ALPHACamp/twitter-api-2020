if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helpers = require('./_helpers')
const bodyParser = require('body-parser')
const session = require('express-session')
const routes = require('./routes')

const app = express()

// bodyparser設定
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
}

app.use(cors())
app.use(routes)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
