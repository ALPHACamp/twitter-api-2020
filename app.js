if (process.env.NODE_NEV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const passport = require('./config/passport')
const methodOverride = require('method-override')

const app = express()
const port = 3000
const routes = require('./routes')


// // use helpers.getUser(req) to replace req.user
// function authenticated (req, res, next) {
//   // passport.authenticate('jwt', { ses...
// };
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
app.use(passport.initialize())
// app.use(methodOverride('_method'))

// app.get('/', (req, res) => res.send('Hello World!'))
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app