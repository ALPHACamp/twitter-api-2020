if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('dotenv').config()
const express = require('express')
// const helpers = require('./_helpers')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000
const router = require('./router/router')
const passport = require('passport')
// cors 的預設為全開放
app.use(cors())

// 可以解讀JSON資料
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// // use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next){
//   // passport.authenticate('jwt', { ses...
// }

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use('/api', router)
app.get('/', (req, res) => res.send('Hello welcome to ac-twiter-server'))
app.use('*', (req, res) => {
  // return an error
  res.status(404).json({
    status: 'error',
    message: '這是個未被定義的路由'
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
