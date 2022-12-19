if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const cors = require('cors')
const express = require('express')
const path = require('path')
// const flash = require('connect-flash')
// const methodOverride = require('method-override')
// const session = require('express-session')
const passport = require('./config/passport')
// const { getUser } = require('./helpers/auth-helpers')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
// const SESSION_SECRET = process.env.SESSION_SECRET

// setting
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(
//   session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
// )

app.use(passport.initialize())
app.use(passport.session())
// app.use(flash())
// app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
// app.use((req, res, next) => {
//   res.locals.success_messages = req.flash('success_messages')
//   res.locals.error_messages = req.flash('error_messages')
//   res.locals.user = getUser(req)
//   next()
// })

app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
