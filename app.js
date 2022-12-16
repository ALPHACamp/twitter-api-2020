// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

const express = require('express')
const routes = require('./routes')
const passport = require('./config/passport')
require('dotenv').config()

const app = express()
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000
// // use helpers.getUser(req) to replace req.user
// function authenticated (req, res, next) {
//   // passport.authenticate('jwt', { ses...
// }

app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize()) 

app.use('/api', routes)
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!!Let's go to http://localhost:${port}`))

module.exports = app
