const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')
const helpers = require('./_helpers')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express({ secret: "devSecretIsVeryMystery", resave: false, saveUninitialized: false }))
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
})

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
