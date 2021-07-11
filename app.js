const express = require('express')
const app = express()
const cors = require('cors')
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3000

const helpers = require('./_helpers')
app.use(methodOverride('_method'))

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use('/upload', express.static(__dirname + '/upload'))

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  return next()
})


require('./routes')(app)

app.use((err, req, res, next) => {
  return res.status(500).json({ Error: String(err) })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
