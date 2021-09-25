const { DataTypes } = require("sequelize/types")

const generateMessage = (text, userId, avatar, type) => {
  console.log('==== generateMessage function ====')
  
  const date = new Date().getTime()
  return {
    text,
    userId,
    avatar,
    type,
    createdAt: date.toLocaleString()
  }
}

module.exports = {
  generateMessage,
}
