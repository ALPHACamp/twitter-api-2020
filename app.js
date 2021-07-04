if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const router = require('./routes');
const helpers = require('./_helpers');
const exphbs = require('express-handlebars')

const app = express()
const port = process.env.PORT

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: false }))


// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};



require('./routes')(app)



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
