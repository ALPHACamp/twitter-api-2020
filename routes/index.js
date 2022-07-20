const db = require('../models')
const User = db.User

module.exports = (app) => {
  app.post('/api/users')
  app.put('/api/users/:id')
  app.get('/api/users/:id/tweets')
  app.get('/api/users/:id/replied_tweets')
  app.get('/api/users/:id/likes')
  app.get('/api/users/:id/followings')
  app.get('/api/users/:id/followers')
  app.get('/api/users/:id')

  app.pots('/api/followships')
  app.delete('/api/followships/:id')

  app.get('/api/tweets')
  app.post('/api/tweets')
  app.post('/api/tweets/:id/like')
  app.post('/api/tweets/:id/unlike')
  app.get('/api/tweets/:id/replies')
  app.post('/api/tweets/:id/replies')
  app.get('/api/tweets/:id')

  app.get('/api/admin/users')
  app.delete('/api/admin/tweets/:id')
}