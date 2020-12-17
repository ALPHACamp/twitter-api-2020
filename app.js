if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT

require('./config/passport')
const routes = require('./routes/index')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(routes)

app.use((err, req, res, next) => {
  console.log(err.stack)
  return res.status(500).json({ status: 'error', message: '內部伺服器錯誤' })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app
