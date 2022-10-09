if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const router = require('./routes/index')
const helpers = require('./_helpers')
const passport = require('./config/passport')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize())
app.use(passport.session())


app.use(router)

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
};

// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app
