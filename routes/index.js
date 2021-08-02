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
    let userId = 1
    const roomOption = {
      where: {
        [Op.or]: [{ User1Id: userId }, { User2Id: userId }],
        [Op.and]: [
          sequelize.literal(
            'EXISTS (select createdAt  from Messages where Messages.RoomId = Room.id LIMIT 1)'
          ),
        ],
      },

      include: [
        {
          model: Message,
          as: 'theOtherUser',
          limit: 1,
          attributes: ['RoomId', 'UserId'],
          include: [
            {
              model: User,
              as: 'Author',
              attributes: ['id', 'avatar', 'name', 'account'],
            },
          ],
          where: {
            id: {
              [Op.ne]: userId,
            },
          },
        },
        {
          model: Message,
          as: 'lastMsg',
          limit: 1,
          include: [
            {
              model: User,
              as: 'Author',
              attributes: ['id', 'avatar', 'name', 'account'],
            },
          ],
          order: [['createdAt', 'desc']],
        },
      ],
      attributes: {
        exclude: ['updatedAt', 'User1Id', 'User2Id', 'createdAt'],
      },
      order: [
        [{ model: sequelize.Message, as: 'lastMsg' }, 'createdAt', 'desc'],
      ],
      limit: 5,
    }
    Room.findAll(roomOption).then((rooms) => {
      rooms.forEach((room) => {
        const user = room.dataValues.theOtherUser[0].dataValues.User
        const lastMsg = room.dataValues.lastMsg[0].dataValues
        room.dataValues.theOtherUser = user
        delete lastMsg.RoomId
        delete lastMsg.UserId
        delete lastMsg.updatedAt
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
      message: 'Page not found.',
    })
  })
}
