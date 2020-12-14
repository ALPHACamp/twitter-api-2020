const express = require('express')
const routes = require('./routes')
const helpers = require('./_helpers')

const app = express()
const port = 3000

routes(app)
app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))

module.exports = app
