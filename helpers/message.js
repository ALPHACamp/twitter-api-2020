const generateMessage = (roomId, text, user, type) => {
  const message = {
    text,
    userId: user.id,
    avatar: user.avatar,
    account: user.account,
    roomId,
    type
  }

  return message
}

module.exports = {
  generateMessage
}