if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const router = require('./routes')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const corsOptions = {
  origin: ['http://localhost:3000', 'https://zionyou.github.io/simple-twitter'], // 允許的網域
  methods: 'GET, POST, PUT, DELETE', // 允許的 HTTP 方法
  allowedHeaders: 'Content-Type, Authorization' // 允許的請求標頭
}
app.use(cors(corsOptions))
app.use(router)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
