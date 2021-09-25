const generateMessage = (text, userId, avatar, isNew) => {
  console.log('==== generateMessage function ====')
  console.log('isNew', isNew)
  return {
    text,
    userId,
    avatar,
    createdAt: new Date().getTime(),
  }
}

module.exports = {
  generateMessage,
}
