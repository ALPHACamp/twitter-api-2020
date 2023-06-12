if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const helpers = require('./_helpers')
const cors = require('cors')
const path = require('path')
// 先關 需要再開
// const methodOverride = require('method-override')
const passport = require('passport')
const router = require('./routes')
const app = express()
const port = process.env.PORT || 3000
// 先用cors的 module試試
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//   res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
//   next()
// })
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(cors())
app.options('*', cors())
// 先關 需要再開
// app.use(methodOverride('_method'))
// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
//    passport.authenticate('jwt', { ses...
};
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use('/api', router)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.info(`Example app listening on port ${port}!`))
module.exports = app
