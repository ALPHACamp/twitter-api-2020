const messageService = require('../services/messageService')

const hasUnreadPublicMessage = async (lastLogin) => {
  const publicMessages = await messageService.getMessages(5)
  const lastMessagesCreatedAt =
    publicMessages[publicMessages.length - 1].createdAt
  return lastMessagesCreatedAt > lastLogin
}

module.exports = { hasUnreadPublicMessage }