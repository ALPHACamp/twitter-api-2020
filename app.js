const express = require('express')
const helpers = require('./_helpers');

const app = express()
const port = 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
};

app.get('/', (req, res) => res.send('Hello World!'))
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.listen(port, () => console.log(`http://localhost:${port}`))
module.exports = app
