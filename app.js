if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
// const helpers = require('./_helpers')
const cors = require('cors')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// use helpers.getUser(req) to replace req.user
// function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
// };

app.use(cors())

app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
