if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
//const helpers = require('./_helpers');
const apis = require('./routes/apis')

const app = express()
const corsOptions = {
  origin: [
    'https://weihung-1010.github.io',
    'http://localhost:8080'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['content-type', 'authorization'],
  preflightContinue: true,
  optionsSuccessStatus: 200
}

const port = process.env.PORT || 3000

app.use(cors(corsOptions))


const SESSION_SECRET = 'secret'

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
//app.use(cors(helpers.corsOptionsDelegate))

app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use('/api', apis)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
