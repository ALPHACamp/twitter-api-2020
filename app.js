if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const passport = require('passport')
const router = require('./routes')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api', router)

app.get('/', (req, res) => res.send('Hello Alphitter!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
