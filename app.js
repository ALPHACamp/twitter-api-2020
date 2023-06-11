// const cors = require('cors')
const express = require('express')
// const helpers = require('./_helpers')
const app = express()
const port = process.env.PORT || 3000
const apis = require('./routes/apis')
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// // use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next){
//   // passport.authenticate('jwt', { ses...
// }
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})
// app.use(cors())
app.use('/api', apis)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
