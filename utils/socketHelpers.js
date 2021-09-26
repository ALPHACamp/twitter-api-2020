const messageService = require('../services/messageService')
const { User } = require('../models')

const hasUnreadPublicMessage = async (lastLogin) => {
  const publicMessages = await messageService.getMessages(5)
  const lastMessagesCreatedAt =
    publicMessages[publicMessages.length - 1].createdAt
  return lastMessagesCreatedAt > lastLogin
}

const updateUserLastJoinPublic = async (currentUserId) => {
  await User.update(
    {
      lastJoinPublic: new Date()
    },
    { where: { id: currentUserId } }
  )

  return User.findByPk(currentUserId, { attributes: ['lastJoinPublic'] })
}

module.exports = { hasUnreadPublicMessage, updateUserLastJoinPublic }
