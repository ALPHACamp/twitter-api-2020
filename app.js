const express = require('express')
const helpers = require('./_helpers');

const db = require('./models')

//-----------
const handlebars = require('express-handlebars')
//-----------

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
};

//for handlebars
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  // helpers: require('./config/handlebars-helpers')
})) //{ defaultLayout: 'main' } could be ignored since it has become default in handlebars v3.1.0
app.set('view engine', 'handlebars')

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
