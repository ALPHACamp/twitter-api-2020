const express = require('express')
const helpers = require('./_helpers')
const router = require('./router/router')
const app = express()
const port = 3000

// 可以解讀JSON資料
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

require('dotenv').config()

// // use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next){
//   // passport.authenticate('jwt', { ses...
// }

app.use('/api', router)

// app.get('/', (req, res) => res.send('Hello World!'))

app.use('*', (req, res) => {
  // return an error
  res.json({
    status: 'error',
    message: '這是個未被定義的路由'
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
