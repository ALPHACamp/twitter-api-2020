const generateMessage = (text, userId) => {
  return {
    text,
    userId,
    createdAt: new Date().getTime()
  }
}

module.exports = {
  generateMessage
}
