'use strict';
const db = require('../models')
const User = db.User

const getUserId = new Promise((resolve, reject) => {
  User.findAll({
    raw: true,
    nest: true,
    where: { role: 'user' }
  })
    .then(users => {
      const userIds = []
      users.forEach(user => {
        userIds.push(user.id)
      })
      return resolve(userIds)
    })
})

function chatmates(userIds) {
  const increment = Number(userIds[1]) - Number(userIds[0])
  const allChatmates = []
  let mateNumber = 4
  userIds.forEach(userId => {
    let currentMate = (Number(userId) + increment)
    for (let i = mateNumber; i >= 0; i--) {
      const chatmate = {
        userAId: userId,
        userBId: currentMate,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      currentMate += increment
      allChatmates.push(chatmate)
    }
    mateNumber -= 1
  })
  return allChatmates
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userIds = await getUserId
    const chatmateSeed = chatmates(userIds)
    await queryInterface.bulkInsert('Chatmates', chatmateSeed, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Chatmates', null, {})
  }
};
