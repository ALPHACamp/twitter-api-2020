let users = require('./api/users')
let tweets = require('./api/tweet')
let admins = require('./api/admin')
let followships = require('./api/followships')
const path = require('path')
const db = require('../models/')
const Room = db.Room
const Message = db.Message
const User = db.User
const sequelize = require('sequelize')
const { Op, QueryTypes } = require('sequelize')

module.exports = (app) => {
  //  local test socket
  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(__dirname,'../index.html'))

  // })
  app.get('/test', (req, res) => {
    const roomOption = {
      where: {
        [Op.or]: [{ User1Id: 2 }, { User2Id: 2 }],
        [Op.and]: [
          sequelize.literal(
            'EXISTS (select createdAt from Messages where Messages.RoomId = Room.id LIMIT 1)'
          )
        ]
      },
      include: [
        {
          model: Message,
          as: 'Messages',
          limit: 1,
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['id', 'avatar', 'account', 'name']
            }
          ]
        }
      ],
      attributes: {
        include: [
          [
            sequelize.literal(
              '(select createdAt from Messages where Messages.RoomId = Room.id LIMIT 1)'
            ),
            'lastMsgTime'
          ],
        ],
        exclude: ['updatedAt', 'User1Id', 'User2Id', 'createdAt']
      },
      order: [[sequelize.literal('lastMsgTime'), 'desc']],
      limit: 5
    }
    Room.findAll(roomOption).then((rooms) => {
      rooms.forEach((room) => {
        const user = room.dataValues.Messages[0].dataValues.User
        // console.log(room.dataValues.Messages[0].dataValues.User)
        room.dataValues.Message = room.dataValues.Messages[0].dataValues.content
        room.dataValues.User = user
        delete room.dataValues.Messages
      })
      res.json(rooms)
    })
  })
  app.use('/api/users', users)
  app.use('/api/tweets', tweets)
  app.use('/api/admin', admins)
  app.use('/api/followships', followships)
  app.use('/', (req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Page not found.'
    })
  })
}
