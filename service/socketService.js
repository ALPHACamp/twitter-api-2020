const userTimelineSeenAt = {} // key(userid) to value(timelineSeenAt)
const db = require('../models')
const {
  User,
  Room,
  Message,
  Reply,
  Like,
  Tweet,
  Followship,
  MessageRecord,
  TimelineRecord
} = db
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const chalk = require('chalk')
const highlight = chalk.bgYellow.black
const notice = chalk.keyword('coral').underline
const detail = chalk.keyword('lightcoral')

let socketService = {
  addNewSocketUserTimelineSeenAt: (socket) => {
    const currentUser = socket.data.user
    if (!userTimelineSeenAt[currentUser.id]) {
      userTimelineSeenAt[currentUser.id] = currentUser.timelineSeenAt
    }
  },
  deleteAndUpdateTimelineSeenAt: async function (socket, io) {
    const userId = socket.data.user.id
    /* find user's other sockets */
    const users = await io.in('User' + userId).allSockets()
    if (users.size > 1) {
      return
    }
    console.log(notice(`[Delete And Update timelineSeenAt] UserID ${userId}`))
    await User.update(
      { timelineSeenAt: userTimelineSeenAt[userId] },
      { where: { id: userId } }
    )
    delete userTimelineSeenAt[userId]
    await this.showAllSocketDetails(io)
  },
  addMessage: async (UserId, RoomId, content) => {
    const message = await Message.create({ UserId, RoomId, content })
    return message
  },
  getPublicRoomUsers: async (io) => {
    const publicRoomUsers = Array.from(await io.in('PublicRoom').fetchSockets())
      .map((socket) => socket.data.user)
      .sort((a, b) => a.id - b.id)
    let pointer = 0 
    for(let i = 1, len = publicRoomUsers.length; i < len; i++){
      if(publicRoomUsers[pointer].id ===publicRoomUsers[pointer + 1].id){
        publicRoomUsers.splice(pointer,1)
      }else {
        ++pointer
      }
    }
    return publicRoomUsers
  },
  getUserRooms: async (UserId, io) => {
    let Rooms = new Set()
    const sockets = await io.in('User' + UserId).fetchSockets()
    for (const socket of sockets) {
      socket.rooms.forEach(room => Rooms.add(room))
    }
    console.log(notice('Get User Rooms:\n'), Rooms)
    return Rooms
  },
  getRoomId: async (User1Id, User2Id) => {
    //for frontend test
    if (!User1Id || !User2Id) {
      return
    }
    //======================
    const roomOptions = {
      where: {
        [Op.or]: [
          { User1Id, User2Id },
          { User1Id: User2Id, User2Id: User1Id }
        ]
      }
    }
    const room = await Room.findOne(roomOptions)
    let roomId
    if (room) {
      console.log(detail('room已存在，roomId為:'), room.id)
      roomId = room.id
    } else {
      roomId = await Room.create({ User1Id, User2Id })
      console.log(detail('建立新的room，roomId為:'), roomId.toJSON())
      roomId = roomId.toJSON().id
    }
    return roomId
  },
  getPrivateRooms: async (userId, offset, limit) => {
    const roomOption = {
      where: {
        [Op.or]: [{ User1Id: userId }, { User2Id: userId }],
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
              attributes: ['id']
            }
          ],
          order: [['createdAt', 'desc']]
        },
        {
          model: User,
          as: 'User1',
          attributes: ['id', 'name', 'account', 'avatar']
        },
        {
          model: User,
          as: 'User2',
          attributes: ['id', 'name', 'account', 'avatar']
        }
      ],
      attributes: {
        exclude: ['updatedAt', 'User1Id', 'User2Id', 'createdAt']
      },
      order: [
        [
          sequelize.literal(
            '(select createdAt from Messages where Messages.RoomId = Room.id order by Messages.createdAt DESC LIMIT 1)'
          ),
          'DESC'
        ]
      ],
      offset,
      limit
    }
    const rooms = await Room.findAll(roomOption).then((rooms) => {
      rooms = rooms.map((room) => {
        room = room.toJSON()
        const user =
          room.User1.id !== userId
            ? room.User1
            : room.User2
        const fromRoomMember = room.Messages[0].User.id !== userId
        const { content, createdAt } = room.Messages[0]
        room = {
          ...room,
          roomMember: user,
          lastMsg: {
            fromRoomMember,
            content,
            createdAt
          }
        }
        delete room.User1
        delete room.User2   
        delete room.Messages
        return room
      })
      return rooms
    })
    return rooms
  },
  getRoomHistory: async (offset, limit, RoomId) => {
    const options = {
      offset,
      limit,
      order: [['createdAt', 'desc']],
      include: [
        {
          model: User,
          attributes: ['avatar'],
          as: 'User'
        }
      ],
      where: {
        RoomId
      }
    }
    let messages = await Message.findAll(options)
    messages = messages.map((message) => {
      message = message.toJSON()
      message.avatar = message.User.avatar
      delete message.User
      return message
    })
    return messages
  },
  getMsgRecord: async (RoomId, SenderId) => {
    const record = await MessageRecord.findOne({
      where: {
        RoomId: RoomId,
        SenderId: SenderId
      }
    })
    return record
  },
  getMsgNotice: async (userId, socket) => {
    if (socket) {
      userId = socket.data.user.id
    }
    const { count } = await MessageRecord.findAndCountAll({
      where: {
        ReceiverId: userId,
        isSeen: false
      }
    })
    return count
  },
  getMsgNoticeDetails: async (userId) => {
    const notices = await MessageRecord.findAll({
      attributes: ['SenderId', 'RoomId', 'unreadNum', 'isSeen'],
      where: {
        ReceiverId: userId,
        unreadNum: { [Op.not]: 0 }
      }
    })
    const unseenRooms = notices
      .filter((notice) => notice.isSeen === false)
      .map((notice) => {
        return {
          SenderId: notice.SenderId
        }
      })
    const unreadRooms = notices.map((notice) => {
      return {
        SenderId: notice.SenderId,
        unreadNum: notice.unreadNum
      }
    })
    return { unseenRooms, unreadRooms }
  },
  getRoomDetailsForReceiver: async (SenderId, ReceiverId) => {
    const roomOption = {
      where: {
        [Op.or]: [
          { User1Id: SenderId, User2Id: ReceiverId },
          { User1Id: ReceiverId, User2Id: SenderId }
        ]
      },
      attributes: {
        exclude: ['updatedAt', 'User1Id', 'User2Id', 'createdAt']
      },
      include: [
        {
          model: User,
          as: 'User1',
          attributes: ['id', 'name', 'account', 'avatar']
        },
        {
          model: User,
          as: 'User2',
          attributes: ['id', 'name', 'account', 'avatar']
        }
      ]
    }
    return await Room.findOne(roomOption).then((room) => {
      room = room.toJSON()
      const user = room.User1.id !== ReceiverId ? room.User1 : room.User2
      room.roomMember = user
      delete room.User1
      delete room.User2
      return room
    })
  },
  getTimelineNotice: async (socket) => {
    const userId = socket.data.user.id
    const timestamp = socket.data.user.timelineSeenAt || new Date(2020, 0, 1)
    const { count } = await TimelineRecord.findAndCountAll({
      where: {
        UserId: userId,
        createdAt: {
          [Op.gt]: timestamp
        }
      }
    })
    console.log(notice(`[Get Timeline Notice] result: ${count}`))
    return count
  },
  getTimelineNoticeDetails: async function (offset, limit, socket) {
    const userId = socket.data.user.id
    const timestamp = socket.data.user.timelineSeenAt || new Date(2020, 0, 1)
    let SeenRecords = []
    const UnseenRecords = await TimelineRecord.findAll({
      offset,
      limit,
      where: {
        UserId: userId,
        createdAt: {
          [Op.gt]: timestamp
        }
      },
      order: [['createdAt', 'desc']]
    })
    if (limit - UnseenRecords.length > 0) {
      SeenRecords = await TimelineRecord.findAll({
        offset: offset + UnseenRecords.length,
        limit: limit - UnseenRecords.length,
        where: {
          UserId: userId
        },
        order: [['createdAt', 'desc']]
      })
    }
    const Unseen = await Promise.all(
      UnseenRecords.map(async (record) => {
        return await socketService.parseTimelineData(record)
      })
    )
    const Seen = await Promise.all(
      SeenRecords.map(async (record) => {
        return await socketService.parseTimelineData(record)
      })
    )
    return { Unseen, Seen }
  },
  parseTimelineData: async (record) => {
    const { id, ReplyId, LikeId, FollowerId, SubscribeTweetId, isRead, createdAt } = record
    const replyOptions = {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: Tweet,
          as: 'RepliedTweet',
          attributes: ['id']
        }
      ],
      attributes: ['id', 'comment', 'createdAt']
    }
    const likeOptions = {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: Tweet,
          as: 'LikedTweet',
          attributes: ['id']
        }
      ],
      attributes: ['createdAt']
    }
    const followerOptions = {
      attributes: ['id', 'name', 'avatar']
    }
    const tweetOptions = {
      attributes: ['id', 'description', 'createdAt'],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar'],
          as: 'Author'
        }
      ]
    }
    if (ReplyId) {
      const reply = await Reply.findByPk(ReplyId, replyOptions)
      return { id, Reply: reply.toJSON(), isRead }
    }
    if (LikeId) {
      const like = await Like.findByPk(LikeId, likeOptions)
      return { id, Like: like.toJSON(), isRead }
    }
    if (FollowerId) {
      const Follower = await User.findByPk(FollowerId, followerOptions)
      return { id, Follower: Follower.toJSON(), isRead, createdAt }
    }
    if (SubscribeTweetId) {
      let tweet = await Tweet.findByPk(SubscribeTweetId, tweetOptions)
      tweet = tweet.toJSON()
      const Subscribing = {}
      Subscribing.User = tweet.Author
      delete tweet.Author
      Subscribing.Tweet = tweet
      return { id, Subscribing, isRead }
    }
  },
  toggleSeenMsgRecord: async (userId) => {
    //更新isSeen為true
    const MsgRecordOption = {
      where: {
        ReceiverId: userId,
        isSeen: false
      },
      attributes: ['id']
    }
    await MessageRecord.findAll(MsgRecordOption).then((records) => {
      records = records.map((record) => record.id)
      MessageRecord.update({ isSeen: true }, { where: { id: records } })
    })
    return
  },
  toggleReadPrivateMsg: async (User1Id, User2Id) => {
    const recordOptions = {
      where: {
        ReceiverId: User1Id,
        SenderId: User2Id
      }
    }
    const record = await MessageRecord.findOne(recordOptions)
    if (record) {
      await record.update({ unreadNum: 0 })
    }
    return
  },
  createMsgRecord: async (RoomId, SenderId, ReceiverId) => {
    const record = await MessageRecord.create({
      SenderId: SenderId,
      ReceiverId: ReceiverId,
      RoomId: RoomId,
      isSeen: true,
      unreadNum: 0
    })
    return record
  },
  seenTimeline: (socket, timestamp) => {
    socket.data.user.timelineSeenAt = userTimelineSeenAt[socket.data.user.id]
    userTimelineSeenAt[socket.data.user.id] = timestamp
    return
  },
  readTimeline:  (timelineId) => {
    return  TimelineRecord.update(
      { isRead: true },
      {
        where: {
          id: timelineId
        }
      }
    )
  },
  showUserOnline: (socket) => {
    console.log(highlight(` User is online: ${socket.data.user.id} / ${socket.id}`))
    console.log(notice('User Info (socket.data.user)\n'), socket.data.user)
  },
  showUserOffline: (socketId) => {
    console.log(highlight(`User is offline: ${socketId}`))
    return
  },
  showJoinPublicRoomNotice: (socket) => {
    console.log(notice(`[Join Public Room] userID: ${socket.data.user.id}`))
    console.log(detail(`socket ID: ${socket.id}`))
    console.log(detail('room result:'), Array.from(socket.rooms), '\n')
  },
  showJoinPrivatePageNotice: (socket, isAdded) => {
    if (isAdded) {
      console.log(notice(`[補 Join Private Page] userID: ${socket.data.user.id}`))
      console.log(detail(`socket ID: ${socket.id}`))
      return
    }
    console.log(notice(`[Join Private Page] userID: ${socket.data.user.id}`))
    console.log(detail(`socket ID: ${socket.id}`))
    console.log(detail('room result:'), Array.from(socket.rooms), '\n')
  },
  showLeavePublicRoomNotice: (socket) => {
    console.log(notice(`[Leave Public Room] userID|${socket.data.user.id}`))
    console.log(detail(`socket ID: ${socket.id}`))
    console.log(detail('room result:'), Array.from(socket.rooms), '\n')
  },
  showAllSocketDetails: async (io) => {
    const allIDs = Array.from(await io.allSockets())
    console.log(detail('all sockets [系統偵測]'), '\n', allIDs)
    const userData = {}
    allIDs.forEach((socketID) => userData[socketID] = io.sockets.sockets.get(socketID).data.user)
    console.log(detail('socket data'), '\n', userData)
    const userRoom = {}
    allIDs.forEach(async (socketID) => userRoom[socketID] = Array.from(io.sockets.sockets.get(socketID).rooms))
    console.log(detail('socket rooms'), '\n', userRoom)
    console.log(detail('user timestamps for timeline:'), '\n', userTimelineSeenAt)
  },
  createTimelineRecord: async (ReceiverId, PostId, type, currentUserId) => {
    if (type === 1) {
      const followOptions = {
        where: {
          followingId: currentUserId,
          isSubscribing: true
        },
        attributes: ['id', 'followerId'],
        raw: true
      }
      let subscribersData = await Followship.findAll(followOptions)
      subscribersData = subscribersData.map((follower) => ({
        UserId: follower.followerId,
        SubscribeTweetId: PostId
      }))
      let data = await TimelineRecord.bulkCreate(subscribersData)
      data = data.map((item) => item.dataValues)
      return {
        receiverId: data.map((item) => item.UserId),
        record: data
      }
    }
    if (type === 2) {
      let record = await TimelineRecord.create({
        UserId: ReceiverId,
        ReplyId: PostId
      })
      record = record.toJSON()
      return {
        receiverId: [ReceiverId],
        record: [record]
      }
    }
    if (type === 3) {
      let record = await TimelineRecord.create({
        UserId: ReceiverId,
        LikeId: PostId
      })
      record = record.toJSON()
      return {
        receiverId: [ReceiverId],
        record: [record]
      }
    }
    if (type === 4) {
      let record = await TimelineRecord.create({
        UserId: ReceiverId,
        FollowerId: PostId
      })
      record = record.toJSON()
      return {
        receiverId: [ReceiverId],
        record: [record]
      }
    }
  },
  sendTimelineNotice: () => {
    return {
      message: 'new timeline_notice'
    }
  },
  atLeastOneUserOnline: async function (receivers, io) {
    for (const receiver of receivers) {
      const result = await io.in('User' + receiver).allSockets()
      if (result.size) {
        return true
      }
    }
    return false
  }
}

module.exports = socketService
