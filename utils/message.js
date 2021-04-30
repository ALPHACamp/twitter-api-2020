const generateMessage = (text, userId, avatar) => {
  return {
    text,
    userId,
    avatar,
    createdAt: new Date().getTime()
  }
}

module.exports = {
  generateMessage
}
