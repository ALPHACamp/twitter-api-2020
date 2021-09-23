if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000

app.use(methodOverride('_method'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors()) // cors 的預設為全開放

app.use('/upload', express.static(__dirname + '/upload'))
app.use(flash())
app.use(session({ secret: 'alphacamp', resave: false, saveUninitialized: false }))

app.use(passport.initialize())
app.use(passport.session())
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, () => {
  console.log('server on')
})

require('./routes')(app)
module.exports = app
