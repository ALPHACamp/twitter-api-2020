if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const apis = require('./routes/apis')
// const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

const methodOverride = require('method-override')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://leemengyun.github.io/ac_twitter_frontend/')
  next()
  app.use('/api', apis)
})
// app.use(cors())
// app.use('/api', apis)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
