const express = require('express')
const helpers = require('./_helpers')

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on http://localhost:${port} !`))

module.exports = app
