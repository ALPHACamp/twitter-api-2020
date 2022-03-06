const notificationController = {
  saveNotification: async (message, type) => {
    const messageType = {
      publicMessage: 1,
      privateMessage: 2,
      tweet: 3,
      reply: 4,
      follow: 5,
      subscription: 6
    }
    
    if (type in messageType)
  }
}

module.exports =  notificationController