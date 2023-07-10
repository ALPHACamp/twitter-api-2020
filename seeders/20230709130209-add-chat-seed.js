'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // find user id first and exclude admin account
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'admin'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // find room id and user in room
    const rooms = await queryInterface.sequelize.query(
      'SELECT id, userOneId, userTwoId FROM Rooms',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const chats = []
    for (let i = 0; i < rooms.length; i++) {
      if (i === 0) {
        chats.push(...Array.from({ length: 6 }, () => ({
          message: faker.lorem.words(2),
          userId: users[Math.floor(Math.random() * users.length)].id,
          roomId: rooms[0].id,
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        })))
      } else {
        for (let j = 0; j < 3; j++) {
          chats.push({
            message: faker.lorem.words(2),
            userId: rooms[i].userOneId,
            roomId: rooms[i].id,
            timestamp: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            message: faker.lorem.words(2),
            userId: rooms[i].userTwoId,
            roomId: rooms[i].id,
            timestamp: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
    }
    await queryInterface.bulkInsert('Chats', chats)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Chats', {})
  }
}
