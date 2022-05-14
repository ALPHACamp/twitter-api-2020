require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// 將 request 導入路由器
app.use(routes)

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app
