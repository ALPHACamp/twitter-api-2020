if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const helpers = require('./_helpers')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/upload', express.static(__dirname + '/upload'))

app.get('/', (req, res) => res.send('請使用API接口'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
