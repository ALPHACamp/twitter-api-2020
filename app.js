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
const corsOptions = {
  origin: [
    process.env.GITHUB_PAGE,
    'http://localhost:3000'
  ],
  method: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

// 先關 需要再開
// app.use(methodOverride('_method'))
// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
//    passport.authenticate('jwt', { ses...
};
app.use('/upload', express.static(path.join(__dirname, '/upload')))
app.use('/api', router)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.info(`Example app listening on port ${port}!`))
module.exports = app
