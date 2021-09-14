// const express = require('express')
// const helpers = require('./_helpers');

// const app = express()
// const port = 3000

// // use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next){
//   // passport.authenticate('jwt', { ses...
// };
// function ensureAuthenticated(req) {
//   return req.isAuthenticated();
// }

// app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// module.exports = app
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')
const app = express()
const PORT = process.env.PORT || 3000

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

app.use(flash())
app.use('/upload', express.static(__dirname + '/upload'))

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))

app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.listen(PORT, () => {
  console.log('server on')
})

require('./routes')(app, passport)
module.exports = app