if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './.env' })
}
console.log('停掉 doteNV')
console.log('停掉 doteNV')
console.log('process.env.NODE_ENV')
console.log('process.env.NODE_ENV')
console.log(process.env.NODE_ENV)
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }
console.log('擺在 doteNV 後')
console.log('擺在 doteNV 後')
console.log('process.env.IMGUR_CLIENT_ID')
console.log('process.env.IMGUR_CLIENT_ID')
console.log(process.env.IMGUR_CLIENT_ID)
console.log('process.env.JWT_SECRET')
console.log('process.env.JWT_SECRET')
console.log(process.env.JWT_SECRET)


const path = require('path')
const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const methodOverride = require('method-override')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
