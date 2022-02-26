'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const checkArray = Array.from({ length: users.length }).map((_, i) => [])
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: users.length * 2 }).map((_, i) => {
        const followerId = Math.floor(Math.random() * users.length)
        let followingId = Math.floor(Math.random() * users.length)
        while (followerId === followingId || checkArray[followerId].includes(followingId)) {
          followingId = Math.floor(Math.random() * users.length)
        }
        checkArray[followerId].push(followingId)
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
