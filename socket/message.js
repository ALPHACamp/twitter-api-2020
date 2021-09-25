const moment = require('moment')

const generateMessage = (text, userId, avatar, type) => {
  console.log('==== generateMessage function ====')
  
  const date = new Date().getTime()
  return {
    text,
    userId,
    avatar,
    type,
    createdAt: moment(date)
  }
}

module.exports = {
  generateMessage,
}
