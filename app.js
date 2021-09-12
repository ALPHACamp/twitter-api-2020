const express = require('express')
const helpers = require('./_helpers');
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const passport = require('./config/passport')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize())

app.use(methodOverride('_method'))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app
