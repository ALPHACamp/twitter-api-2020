const db = require('../models')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const { RoomUser, User, Subscribeship, Notification, Room, Message } = db
function turnToBoolean(data, attribute) {
  if (Array.isArray(data)) {
    data.forEach(data => {
      if (data[`${attribute}`] === 1) {
        data[`${attribute}`] = true
      } else data[`${attribute}`] = false
    })
  } else {
    // 處理物件
    if (data[`${attribute}`] === 1) {
      data[`${attribute}`] = true
    } else data[`${attribute}`] = false
  }
}

async function getRoomUsers(RoomId) {
  try {
    return await RoomUser.findAll({
      raw: true, nest: true,
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('UserId')), 'UserId'],
      ],
      where: { RoomId },
      include: { model: User, attributes: ['name', 'account', 'avatar'] }
    })
  } catch (err) {
    console.warn(err)
  }
}

function addClientToMap(UserId, socketId, userSocketIdMap) {
  if (!userSocketIdMap.has(UserId)) {
    // 剛登入，加入在線名單
    userSocketIdMap.set(UserId, new Set([socketId]));
  } else {
    // 使用者開多個視窗在線，就添加socketId
    userSocketIdMap.get(UserId).add(socketId); //取得此人的socket set，並用set add方法加入
  }
}

function removeClientFromMap(UserId, socketId, userSocketIdMap) {
  if (userSocketIdMap.has(UserId)) {
    let socketIdSet = userSocketIdMap.get(UserId) //取得值，也就是socketId陣列
    socketIdSet.delete(socketId) //將socketId從set中刪除
    // 如果都刪光了，代表說使用者真的下線了
    if (socketIdSet.length === 0) {
      userSocketIdMap.delete(UserId)
    }
  }


}

function getEmitSockets(subscribers, userSocketIdMap) {
  // 發送通知給有在線的訂閱戶 
  let notifySockets = []
  // 將通知對象整理成id陣列
  subscribers = subscribers.map(d => (d.targetId))
  // 判斷是否有在線，如果有則取得該訂閱戶的sockets
  for (let entry of userSocketIdMap) {  // entry = [11, set {'socketId','socketId'}]
    const isOnline = subscribers.includes(entry[0])
    if (isOnline) {
      notifySockets.push(entry[1])
    }
  }
  // 將set轉為陣列 [Set {'abc','dec'}, set {'123'}] => ['abc','dec','123']
  if (notifySockets.length === 0) {
    return Array.from(notifySockets) //不用通知
  }
  else {
    return Array.from(...notifySockets)
  }
}

async function CreateNotification(sourceKey, sourceValue, subscribingId) {
  try {
    // 撈出該用戶的訂閱者(通知對象)
    let subscribers = await Subscribeship.findAll({
      attributes: [['subscriberId', 'targetId'], ['subscribingId', 'triggerId']],
      raw: true,
      where: {
        subscribingId
      }
    })

    // 整理要紀錄到notification的資料,加上推文id
    subscribers.forEach(data => {
      data[`${sourceKey}`] = sourceValue  // [ { targetId: 11, triggerId: 31, TweetId: 1 } ]
    })

    // 紀錄通知到 Notifications table
    await Notification.bulkCreate(
      subscribers
      , { returning: true })

    return subscribers
  } catch (err) {
    console.warn(err)
  }
}

async function leavePublicRoom(io, user) {
  try {
    // 清除在房資料
    await RoomUser.destroy({
      where: {
        UserId: user.id,
        socketId: user.socketId,
        RoomId: 1
      }
    })

    // 離線後，確認房間是否還有user，沒的話才傳
    const result = await RoomUser.findAll({
      raw: true, nest: true,
      where: {
        RoomId: 1,
        UserId: user.id
      }
    })

    if (result.length === 0) {
      io.to(1).emit('connect status', `${user.name} 離開聊天室`)
    }
  } catch (err) {
    console.warn(err)
  }
}

async function leaveAllPrivateRoom(io, user) {
  try {
    let allRoom = await Room.findAll({
      raw: true,
      attributes: ['id'],
      where: {
        [sequelize.Op.or]: [{ creatorId: user.id }, { joinerId: user.id }]
      }
    })
    // 轉成socketsLeave 接受的房間陣列 [{id: 12}, {id: 55}] => [12, 55]
    allRoom = allRoom.map(room => (room.id))
    // 清除在房資料
    await RoomUser.destroy({
      where: {
        UserId: user.id,
        socketId: user.socketId,
      }
    })
    io.in(user.socketId).socketsLeave([allRoom]);
  } catch (err) {
    console.warn(err)
  }
}

async function emitChatList(io, loginUser) {
  try {
    // TODO:更新聊天紀錄人員列表，回傳的使用者資料排除登入使用者的，只回傳對方資料
    let chatList = await Room.findAll({
      raw: true, nest: true,
      attributes: ['id',
        [
          sequelize.literal(`(SELECT content FROM Messages WHERE RoomId = Room.id ORDER BY createdAt DESC LIMIT 1)`), 'massage'
        ],
        [
          sequelize.literal(`(SELECT isRead FROM Messages WHERE RoomId = Room.id ORDER BY createdAt DESC LIMIT 1)`), 'isRead'
        ],
        [
          sequelize.literal(`(SELECT createdAt FROM Messages WHERE RoomId = Room.id ORDER BY createdAt DESC LIMIT 1)`), 'createdAt'
        ],
      ],
      where: {
        [sequelize.Op.or]: [
          { joinerId: loginUser.id },
          { creatorId: loginUser.id }
        ]
      },
      include: [{
        model: User,
        as: 'Creator',
        attributes: ['id', 'account', 'avatar', 'name']
      },
      {
        model: User,
        as: 'Joiner',
        attributes: ['id', 'account', 'avatar', 'name']
      }
      ],
      order: sequelize.literal(`CASE WHEN isRead = 0 THEN 0 ELSE 1 END, createdAt DESC`)
    })

    // 只回傳聊天對象的個人資料。 [{user: {個人資料}}, {user: {個人資料}}]
    chatList.forEach(data => {
      if (data.Creator.id === loginUser.id) {
        delete data.Creator
        // 沒被刪掉的就是聊天對象，將key改為user
        delete Object.assign(data, { ['user']: data['Joiner'] })['Joiner']
      } else {
        // 如果A不是登入者，就是聊天對象，此時刪掉B，並將key(A)改為user
        delete data.Joiner
        delete Object.assign(data, { ['user']: data['Creator'] })['Creator']
      }
    })

    return io.except(1).emit('chat member list', chatList)
  } catch (err) {
    console.warn(err)
  }
}

async function updateMessage(io, message, user, RoomId, targetUserId) {
  try {
    const sendUser = await User.findOne({
      where: { id: user.id },
      attributes: ['id', 'name', 'avatar', 'account']
    })
    // 寫入歷史訊息
    if (RoomId === 1) {
      message = await Message.create({
        content: message,
        RoomId,
        senderId: user.id,
        receiver: null,
      })
    } else {
      // 判斷對方有無在該私人房間，如有，isRead改為true
      // TODO:既然已經在加入房間時更新訊息，是否這裡就不需要了，應該不行，如果同時在線就還是未讀吧？
      const isTargetOnline = await RoomUser.findOne({
        where: {
          RoomId,
          UserId: targetUserId
        }
      })

      const isRead = isTargetOnline ? true : false

      message = await Message.create({
        RoomId,
        content: message,
        senderId: user.id,
        receiverId: targetUserId,
        isRead
      })
    }

    // 包成物件傳到前端，訊息內容＋發送者的個人資料
    const data = {
      message: message.toJSON(),
      user: sendUser.toJSON()
    }
    io.to(RoomId).emit('updated message', data)
  } catch (err) {
    console.warn(err)
  }
}

async function loginValidation(account, password, cb) {
  try {
    if (!account || !password) {
      return { status: '401', message: '所有欄位都是必填項', data: { account, password } }
    }
    const user = await User.findOne({ where: { account } })
    if (!user) {
      return { status: '401', message: '帳號不存在', data: { account, password } }
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return { status: '401', message: '密碼錯誤', data: { account, password } }
    }
    return { user: user.toJSON() }
  } catch (err) {
    console.warn(err)
    return { status: '500', message: err }
  }
}

module.exports = { turnToBoolean, getRoomUsers, addClientToMap, removeClientFromMap, getEmitSockets, CreateNotification, leavePublicRoom, emitChatList, leaveAllPrivateRoom, updateMessage, loginValidation }
