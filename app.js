if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')
const flash = require('connect-flash')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000


// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
};

app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.get('/', (req, res) => res.send('Hello World!'))
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.listen(port, () => console.log(`http://localhost:${port}`))
module.exports = app
