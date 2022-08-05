if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const helpers = require('./_helpers');
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 3000

// cors 的預設為全開放
app.use(cors())

const passport = require('./config/passport')
// use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next) {
//   // passport.authenticate('jwt', { ses...
// };

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app

const router = require('./routes')
router(app)
module.exports = app
