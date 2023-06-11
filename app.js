if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const apis = require('./routes/apis')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

const methodOverride = require('method-override')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

app.use(cors({
  origin: '*'
}))
app.use('/api', apis)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
