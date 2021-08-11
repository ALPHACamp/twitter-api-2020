const socketService = require('../../service/socketService')
const chalk = require('chalk')
const highlight = chalk.bgYellow.black
const notice = chalk.keyword('lawngreen').underline
const detail = chalk.keyword('yellowgreen')

let socketController = {
  /* ---------------- PUBLIC ROOM ---------------- */
  joinPublicRoom: async (socket, io) => {
    const userRooms = await socketService.getUserRooms(socket.data.user.id, io)
    /* -------- renew data -------- */
    await socket.join('PublicRoom')
    /* -------- logs -------- */
    socketService.showJoinPublicRoomNotice(socket)
    await socketService.showAllSocketDetails(io)
    /* -------- emits -------- */
    if (!userRooms.has('PublicRoom')) {
      io.emit('new_join', {
        name: socket.data.user.name
      })
    }
    const users = await socketService.getPublicRoomUsers(io)
    io.emit('online_users', {
      users
    })
  },
  leavePublicRoom: async (socket, io) => {
    /* -------- renew data -------- */
    await socket.leave('PublicRoom')
    socketService.showLeavePublicRoomNotice(socket)
    /* -------- logs -------- */
    await socketService.showAllSocketDetails(io)
    /* -------- emits -------- */
    io.emit('user_leave', {
      name: socket.data.user.name
    })
    const users = await socketService.getPublicRoomUsers(io)
    io.emit('online_users', {
      users
    })
  },
  postPublicMsg: async (content, socket) => {
    const publicRoomId = 1
    const userId = socket.data.user.id
    if (!content) {
      return
    }
    const message = await socketService.addMessage(
      userId,
      publicRoomId,
      content
    )
    socket.broadcast.to('PublicRoom').emit('get_public_msg', {
      content: message.content,
      createdAt: message.createdAt,
      avatar: socket.data.user.avatar
    })
  },
  /* ---------------- PRIVATE PAGE ---------------- */
  joinPrivatePage: async function (socket, io, isAdded) {
    /* -------- renew data -------- */
    await socket.join('PrivatePage')
    await socketService.toggleSeenMsgRecord(socket.data.user.id)
    /* -------- logs -------- */
    socketService.showJoinPrivatePageNotice(socket, isAdded)
    await socketService.showAllSocketDetails(io)
    /* -------- emits -------- */
    // get_msg_notice_details
    const getMsgNoticeDetails = await socketService.getMsgNoticeDetails(socket.data.user.id)
    socket.emit('get_msg_notice_details', getMsgNoticeDetails)
    console.log(notice(`[EMIT] get_msg_notice_details → ${socket.data.user.id}`, detail('\n', JSON.stringify(getMsgNoticeDetails))))
  },
  joinPrivateRoom: async function (User1Id, User2Id, roomId, socket, io) {
    /* -------- check missing event -------- */
    if (!socket.rooms.has('PrivatePage')) {
      this.joinPrivatePage(socket, io, true)
    }
    /* -------- renew data -------- */
    if (!roomId) {
      roomId = await socketService.getRoomId(User1Id, User2Id)
    }
    await socketService.toggleReadPrivateMsg(User1Id, User2Id)
    await io.in(socket.id).socketsLeave(Array.from(socket.rooms).filter(roomID => Number.isInteger(roomID)))
    await socket.join(roomId)
    await socketService.showAllSocketDetails(io)
    console.log(detail(`最後roomId結果: ${roomId} `))
    return roomId
  },
  leavePrivatePage: async (socket, io) => {
    /* -------- renew data -------- */
    await io.in(socket.id).socketsLeave(Array.from(socket.rooms).filter(roomID => Number.isInteger(roomID)))
    await socket.leave('PrivatePage')
    /* -------- logs -------- */
    console.log(detail(`${socket.id}room result:\n`), Array.from(socket.rooms))
  },
  postPrivateMsg: async (SenderId, ReceiverId, RoomId, content, socket, io) => {
    if (!content) {
      return
    }
    const user = socket.data.user
    /* -------- save message -------- */
    const message = await socketService.addMessage(SenderId, RoomId, content)
    /* -------- send to Receiver -------- */
    let receiverRooms = await socketService.getUserRooms(ReceiverId, io) // {Set}

    /* ---- Receiver is in room ---- */
    /* no update */
    if (
      receiverRooms.has('PrivatePage') &&
      receiverRooms.has(message.RoomId)
    ) {
      /* emit */
      const createdAt = message.createdAt
      const avatar = user.avatar
      socket.to(RoomId).emit('get_private_msg', {
        UserId: SenderId,
        RoomId,
        content,
        avatar,
        createdAt
      })
      /* logs */
      console.log(detail(`Receiver ${ReceiverId} is in room`))
      console.log(notice(`[EMIT] get_private_msg → Room ${RoomId}`))
      return
    }

    /* ---- Receiver is not in room ---- */
    /* get record */
    let record = await socketService.getMsgRecord(RoomId, SenderId)
    if (!record) {
      record = await socketService.createMsgRecord(RoomId, SenderId, ReceiverId)
    }
    /* update record */
    const unreadNum = record.unreadNum + 1
    await record.update({ isSeen: false, unreadNum: ++record.unreadNum })
    if (receiverRooms.size) {
      /* ---- Receiver is online ---- */
      console.log(detail(`Receiver ${ReceiverId} is online`))
      if (receiverRooms.has('PrivatePage')) {
        /* ---- Receiver is on private page ---- */
        /* find data */
        await record.update({ isSeen: true })
        const updateMsgNoticeDetails =
          await socketService.getRoomDetailsForReceiver(SenderId, ReceiverId)
        updateMsgNoticeDetails.lastMsg = {
          fromRoomMember: true,
          content: message.content,
          createdAt: message.createdAt
        }
        updateMsgNoticeDetails.unreadNum = unreadNum
        /* emit */
        io.to('User' + ReceiverId).emit('update_msg_notice_details', updateMsgNoticeDetails)
        /* logs */
        console.log(detail(`Receiver ${ReceiverId} is on private page but not in room`))
        console.log(notice(`[EMIT] update_msg_notice_details →`), await io.in('User' + ReceiverId).allSockets())
        return
      } else {
        /* ---- Receiver is not on private page ---- */
        await record.save()
        /* find data */
        const getMsgNotice = await socketService.getMsgNotice(ReceiverId, null)
        /* emit */
        io.to('User' + ReceiverId).emit('get_msg_notice', getMsgNotice)
        /* logs */
        console.log(detail(`Receiver ${ReceiverId} is not on private page`))
        console.log(notice(`[EMIT] get_msg_notice →`), await io.in('User' + ReceiverId).allSockets())
        return
      }
    }
    /* save final data */
    await record.save()
  },
  /* ---------------- TIMELINE ---------------- */
  postTimeline: async (ReceiverId, type, PostId, socket, io) => {
    /* -------- create TimelineRecord -------- */
    const records = await socketService.createTimelineRecord(
      ReceiverId,
      PostId,
      type,
      socket.data.user.id
    )
    const receivers = records.receiverId // Array
    const record = records.record
    console.log(notice(`[Create Timeline Record]\n`), record[0])
    /* -------- at least one receiver online -------- */
    let atLeastOneUserOnline = await socketService.atLeastOneUserOnline(receivers, io)
    if (atLeastOneUserOnline) {
      const noticeDetail = await socketService.parseTimelineData(record[0])
      receivers.forEach(async (receiver, i) => {
        const getUserSocketIds = await io.in('User' + receiver).allSockets()
        /* -------- receiver online -------- */
        if (getUserSocketIds.size) {
          const receiverRooms = await socketService.getUserRooms(receiver, io)
          /* -------- receiver on Timeline Page -------- */
          if (receiverRooms.has('TimelinePage')) {
            /* update timelineSeenAt */
            socketService.seenTimeline(receiver, record[0].createdAt)
            /* emit: send details to receiver */
            await io.to('User' + receiver).emit('update_timeline_notice_detail', noticeDetail)
            console.log(notice(`[EMIT] update_timeline_notice_detail → Receiver ${receiver}`))
            return
          }
          /* -------- receiver not on Timeline Page -------- */
          /* emit: send notice to receiver */
          socket.to('User' + receiver).emit('update_timeline_notice', socketService.sendTimelineNotice())
          console.log(notice(`[EMIT] update_timeline_notice → Receiver ${receiver}`))
        }
      })
    }
  }
}

module.exports = socketController
