const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000

// 載入 cors
app.use(cors())

// 載入 bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// 載入 routes
require('./routes')(app)

// 設置錯誤訊息
app.use((err, req, res) => {
  if (err) {
    res.status(555).json({ message: String(err) })
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
