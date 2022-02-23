const express = require('express')
const passport = require('./config/passport')
const helpers = require('./_helpers');

const app = express()
const port = 3000


// 初始化passport
app.use(passport.initialize())

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
};

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
