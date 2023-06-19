if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const express = require('express')
const helpers = require('./_helpers');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
const passport = require('./config/passport')
const routes = require('./routes')

// const allowedOrigins = ['http://localhost:3000', 'https://owenlu0125.github.io/'];
// const corsOptions = {
//   origin: ['http://localhost:3000','https://owenlu0125.github.io/'],
//   optionsSuccessStatus: 200
// }
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       let msg = 'The CORS policy for this site does not ' +
//         'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));
// app.use(cors({
//   origin: ['http://localhost:3000', 'https://owenlu0125.github.io/'],
// }));
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use('/upload', express.static(path.join(__dirname, 'upload')))
// router
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
