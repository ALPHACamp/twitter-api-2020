const generateMessage = data => {
  return {
    content: data.msg,
    username: data.username,
    createdAt: new Date().getTime()
  }
}

module.exports = generateMessage
