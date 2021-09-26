const messageService = require('../services/messageService')
const { User } = require('../models')

const hasUnreadPublicMessage = async (lastLogin) => {
  const publicMessages = await messageService.getMessages(5)
  const lastMessagesCreatedAt =
    publicMessages[publicMessages.length - 1].createdAt
  return lastMessagesCreatedAt > lastLogin
}

const updateUserLastLogin = async (currentUserId) => {
  await User.update(
    {
      lastLogin: new Date()
    },
    { where: { id: currentUserId } }
  )

  return User.findByPk(currentUserId, { attributes: ['lastLogin'] })
}

module.exports = { hasUnreadPublicMessage, updateUserLastLogin }
