const express = require('express')
const helpers = require('./_helpers')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(cors())

app.get('/api/test', (req, res) => res.json({ 
  status: 'success',
  data: {
    id: 1,
    name: 'user1',
    email: 'user1@example.com',
    account: 'user1',
    introduction: 'I am Iron Man!'
  }
}))
app.get('/', (req, res) => res.send('hello world'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
