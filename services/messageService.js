const RequestError = require('../libs/RequestError')
const db = require('../models')
const { Room, Member, User, Message, Sequelize, sequelize } = db
const { Op } = Sequelize

const messageService = {
  saveMessage: (msg) => {
    if (!msg.content) {
      throw new RequestError('Empty input, no msg to save')
    }
    if (!msg.id) {
      throw new RequestError('Save message failed, login to send message')
    }
    let concat = ''
    if (msg.listenerId) {
      if (msg.id < msg.listenerId) {
        concat = `${msg.id}n${msg.listenerId}`
      } else {
        concat = `${msg.listenerId}n${msg.id}`
      }
    }
    return Message.create({
      UserId: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      updatedAt: msg.createdAt,
      roomId: msg.listenerId ? concat : null,
      isRead: msg.isInRoom
    }).then(message => {
      message = message.toJSON()
      message.messageId = message.id
      message.id = message.UserId
      message.avatar = msg.avatar
      if (msg.listenerId) {
        message.listenerId = msg.listenerId
      }
      delete message.UserId
      delete message.updatedAt
      delete message.roomId

      return message
    })
  },

  getMessages: async (msg) => {
    if (!msg.isPrivate) {
      throw new RequestError(`isPrivate is empty`)
    }

    if (msg.isPrivate === 'true') {
      if (!msg.id || !msg.listenerId) {
        let errorMsgs = []

        !msg.id ? errorMsgs.push('id') : ''
        !msg.listenerId ? errorMsgs.push('listenerId') : ''

        throw new RequestError(`${errorMsgs.join(', ')} is empty`)
      }
    }



    let whereClause = {}
    let concat = ''
    if (msg.listenerId) {
      if (msg.id < msg.listenerId) {
        concat = `${msg.id}n${msg.listenerId}`
      } else {
        concat = `${msg.listenerId}n${msg.id}`
      }
    }
    switch (msg.isPrivate) {
      case 'true':
        whereClause = { roomId: concat }
        break
      case 'false':
        whereClause = { roomId: null }
        break
    }
    return Message.findAll({
      where: whereClause,
      order: [['createdAt', 'ASC']],
      include: { model: User },
      raw: true,
      nest: true
    }).then(msg => {
      msg = msg.map((msg, i) => {
        if (!msg) {
          return []
        }
        const mapItem = {
          id: msg.UserId,
          avatar: msg.User.avatar,
          content: msg.content,
          createdAt: msg.createdAt
        }
        return mapItem
      })
      return msg
    })
  },

  searchUnread: (io, socket, msg) => {
    return Message.count({
      where: {
        [Op.and]: [{
          roomId: {
            [Op.or]: [
              { [Op.like]: `${msg.id}n%` },
              { [Op.like]: `%n${msg.id}` }
            ]
          }
        },
        { isRead: false },
        { UserId: { [Op.ne]: msg.id } }
        ]
      }
    }).then(count => {
      return { unreadCount: count }
    })
  },

  clearUnread: (io, socket, msg) => {
    let firstId
    let secondId
    if (msg.id > msg.listenerId) {
      firstId = msg.listenerId
      secondId = msg.id
    } else if (msg.id < msg.listenerId) {
      firstId = msg.id
      secondId = msg.listenerId
    }

    return Message.update({ isRead: true }, {
      where: {
        [Op.and]: [
          { UserId: msg.listenerId },
          { RoomId: `${firstId}n${secondId}` }
        ]
      }
    })
  },

  getChattedUsers: async (id) => {
    try {
      const results = await sequelize.query(`
      Select temp.UserId as 'id', users.account, users.avatar, users.name, messages.content, messages.createdAt as 'createdAt'
      From messages
      inner join(
        Select MAX(messages.createdAt) as 'createdAt', messages.roomId, membersNoUser.UserId From messages
        inner join(
          select * from members where members.UserId != ${Number(id)}
        ) as membersNoUser
        on membersNoUser.RoomId = messages.roomId
        where(messages.roomId like '%n${id}' or messages.roomId like '${id}n%')
        Group by roomId
      ) as temp
      on messages.createdAt = temp.createdAt and messages.roomId = temp.roomId
      left join users on users.id = temp.UserId
      order by createdAt DESC
      `, { type: Sequelize.QueryTypes.SELECT })

      return results
    } catch (error) {
      throw new Error(error.message)
    }
  },

  createPrivateRoom: async (id, listenerId, roomName) => {
    try {
      const users = await messageService.getChattedUsers(id)
      const hasRoom = users.some((user, i) => { return user.id === listenerId })
      if (!hasRoom) {
        await Room.create({ id: `${roomName}` })
        await Member.bulkCreate([{ RoomId: roomName, UserId: id }, { RoomId: roomName, UserId: listenerId }])
      }

      return {
        status: 'success',
        message: `Created Room: ${roomName} successfully`
      }
    } catch (error) {
      return {
        status: error.name,
        message: error.message
      }
    }

  }
}

module.exports = messageService
