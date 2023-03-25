if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
console.log('停掉 doteNV')
console.log('停掉 doteNV')
console.log('process.env.NODE_ENV')
console.log('process.env.NODE_ENV')
console.log(process.env.NODE_ENV)
console.log('擺在 doteNV 後')
console.log('擺在 doteNV 後')
console.log('process.env.IMGUR_CLIENT_ID')
console.log('process.env.IMGUR_CLIENT_ID')
console.log(process.env.IMGUR_CLIENT_ID)
console.log('process.env.JWT_SECRET')
console.log('process.env.JWT_SECRET')
console.log(process.env.JWT_SECRET)


const cors = require('cors')
const express = require('express')
const helpers = require('./_helpers')

const app = express()
const port = process.env.PORT || 3000

const routes = require('./routes')

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors())

app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
