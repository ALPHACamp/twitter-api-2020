if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const methodOverride = require('method-override')

const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000

// use method-override
app.use(methodOverride('_method'))

// use body parser to handle all the request
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(routes)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app
