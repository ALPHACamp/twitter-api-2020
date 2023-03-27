if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const express = require('express')
const helpers = require('./_helpers')
const passport = require('./config/passport')
const router = require('./routes')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use('/api', router)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
