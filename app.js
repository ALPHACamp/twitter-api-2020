const express = require('express')
const methodOverride = require('method-override')

const helpers = require('./_helpers');
const routes = require('./routes/index')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(routes)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app