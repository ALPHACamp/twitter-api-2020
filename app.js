if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers');
const app = express()
const port = 3000
const passport = require('./config/passport')
const userController = require('./controllers/apis/user-controller')
const flash = require('connect-flash')
// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.post('/api/signin', passport.authenticate('local',
  { session: false }), userController.signIn)
app.post('/api/signup', userController.signUp)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
