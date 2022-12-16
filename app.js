if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const express = require('express')
const routes = require('./routes')
const passport = require('./config/passport')
require('dotenv').config()
const cors = require('cors')
const { generalErrorHandler } = require('./middleware/error-handler')
const app = express()
const port = process.env.PORT || 3000

const corsOptions = {
	origin: ['https://yhosutun2490.github.io', 'http://localhost:3000'],
	methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'HEAD', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(express.json())
app.use(cors(corsOptions))

app.use('/api', routes)
app.use(routes)

app.use('/', (req, res) => res.send('Hello World!'))
app.use(generalErrorHandler)

app.listen(port, () => console.log(`Example app listening on port ${port}!!Let's go to http://localhost:${port}`))

module.exports = app