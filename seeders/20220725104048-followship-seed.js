'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    users.shift()

    await queryInterface.bulkInsert('Followships',
      Array.from({ length: users.length * 3 }).map((_, index) => {
        const followerId = Math.floor(index / 3)
        let followingId = Math.floor(Math.random() * users.length)
        while (followerId === followingId) {
          followingId = Math.floor(Math.random() * users.length)
        }
        return {
          followerId: users[followerId].id,
          followingId: users[followingId].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
