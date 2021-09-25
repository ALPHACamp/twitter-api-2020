const generateMessage = (text, userId, avatar, type) => {
  console.log('==== generateMessage function ====')
  
  return {
    text,
    userId,
    avatar,
    type,
    createdAt: new Date().getTime().toTimeString(),
  }
}

module.exports = {
  generateMessage,
}
