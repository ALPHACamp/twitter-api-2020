// const router = require('express').Router()
const apis = require('./apis')

module.exports = (app, passport) => {
  app.use('/api', apis)
}
