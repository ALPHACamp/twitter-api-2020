if (process.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')
const passport = require('./config/passport')
const cors = require('cors')
const corsOptions = {
  origin: '＊',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
}

const app = express()

app.use(cors(corsOptions))
// bodyparser設定
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// passport 初始化
app.use(passport.initialize())
app.use(passport.session())

app.use('/upload', express.static(path.join(__dirname, 'upload')))

const port = process.env.PORT || 3001

app.use('/api', routes)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
