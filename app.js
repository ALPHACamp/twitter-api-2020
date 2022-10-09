if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
// const helpers = require('./_helpers')

const app = express()
const port = 3000
const router = require('./router/router')
const passport = require('passport')

// 可以解讀JSON資料
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// // use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next){
//   // passport.authenticate('jwt', { ses...
// }

app.use(passport.initialize())
// app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api', router)
app.use('*', (req, res) => {
  // return an error
  res.json({
    status: 'error',
    message: '這是個未被定義的路由'
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
