if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
} //放在最前面好安心
const express = require('express')
const cors = require('cors')
const passport = require('./config/passport')
const app = express()
const port = process.env.PORT || 3000



app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // POST json格式
app.use(passport.initialize())



require('./routes')(app)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))



module.exports = app
