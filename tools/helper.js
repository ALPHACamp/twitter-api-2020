const db = require('../models')
const sequelize = require('sequelize')
const { RoomUser, User } = db
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
  // 將set轉為陣列 [set {'abc','dec'}, set {'123'}] => ['abc','dec','123']
  return Array.from(...notifySockets)
}
module.exports = { turnToBoolean, getRoomUsers, addClientToMap, removeClientFromMap, getEmitSockets }
