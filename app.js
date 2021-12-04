const express = require('express')
const helpers = require('./_helpers');
const routes = require('./routes')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
const passport = require('./config/passport')

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize())

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(cors());
app.use(routes)


module.exports = app
