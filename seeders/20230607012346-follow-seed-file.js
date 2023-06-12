'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const followships = Array.from({ length: 30 }, (d, i) => {
      const followerId = users[Math.floor(Math.random() * users.length)].id
      let followingId = users[Math.floor(Math.random() * users.length)].id

      while (followerId === followingId) {
        followingId = users[Math.floor(Math.random() * users.length)].id
      }

      return {
        follower_Id: followerId,
        following_Id: followingId,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    await queryInterface.bulkInsert('Followships', followships)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
