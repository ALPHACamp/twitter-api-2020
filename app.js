const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const app = express()
const port = 3000

const passport = require('passport')

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: 'itismyserect', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/upload', express.static(__dirname + '/upload'))

app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message')
  res.locals.error_message = req.flash('error_message')
  res.locals.user = helpers.getUser(req)
  next()
})


//Yating: 我不太確定這函式放在這邊的用意，目前是寫在routes檔案內
// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // const user = helpers.getUser(req)
  // return passport.authenticate('jwt', { session: false })
  // next()
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "No auth token" })
    }
    req.user = user
    return next()
  })(req, res, next)
};


app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))

require('./routes')(app)

module.exports = app