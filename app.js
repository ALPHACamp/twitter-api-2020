if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'ghactions') {
  require('dotenv').config()
}
const express = require('express')
const passport = require('./config/passport')
const router = require('./routes')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize()) // 初始化 Passport

app.use('/api', router)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
