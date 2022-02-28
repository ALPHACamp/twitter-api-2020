if (process.env.NODE_NEV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const passport = require('./config/passport')

const app = express()
const port = 3000
// const route = require('./routes')
const {
  apis
} = require('./routes')

// // use helpers.getUser(req) to replace req.user
// function authenticated (req, res, next) {
//   // passport.authenticate('jwt', { ses...
// };
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
app.use(passport.initialize())

// app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api', apis)
// app.use(route)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app