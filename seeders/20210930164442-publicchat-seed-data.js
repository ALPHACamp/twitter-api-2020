'use strict';
const db = require('../models')
const User = db.User
const faker = require('faker');

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

function publicchats(userIds) {
  // const increment = Number(userIds[1]) - Number(userIds[0])
  const allPublicChats = []
  let chatNumber = 4
  userIds.forEach(userId => {
    // let currentMate = (Number(userId) + increment)
    for (let i = chatNumber; i >= 0; i--) {
      const chat = {
        speakerId: userId,
        chatContent: faker.lorem.text().substring(0, 50),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      // currentMate += increment
      allPublicChats.push(chat)
    }
    chatNumber -= 1
  })
  return allPublicChats
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userIds = await getUserId
    const publicChatSeed = publicchats(userIds)
    await queryInterface.bulkInsert('Publicchats', publicChatSeed, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Publicchats', null, {})
  }
};
