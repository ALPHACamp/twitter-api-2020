const express = require('express')
// const helpers = require('./_helpers')
const app = express()
const port = 3000
const apis = require('./routes/apis')
const methodOverride = require('method-override')

app.use(methodOverride('_method'))

// // use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next){
//   // passport.authenticate('jwt', { ses...
// }

app.use('/api', apis)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
