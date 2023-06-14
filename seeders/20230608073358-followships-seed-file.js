'use strict'

const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const DEFAULT_EACH_USER_FOLLOWS = 2 || users.length - 1
    const totalFollows = users.length * DEFAULT_EACH_USER_FOLLOWS
    let userArray = users
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: totalFollows }, (_, index) => {
        const remind = index % DEFAULT_EACH_USER_FOLLOWS
        const followerId = users[Math.floor(index / DEFAULT_EACH_USER_FOLLOWS)].id
        if (remind === 0) userArray = users
        userArray = userArray.filter(a => a.id !== followerId)
        const followingId = userArray[Math.floor(Math.random() * userArray.length)].id
        userArray = userArray.filter(a => a.id !== followingId)
        return {
          followerId,
          followingId,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent()
        }
      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
