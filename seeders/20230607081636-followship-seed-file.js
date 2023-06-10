'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users WHERE role = "user";', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    })

    const followships = []

    for (let i = 0; i < 5; i++) {
      let followingId, followerId

      // random following_id
      followingId = users[Math.floor(Math.random() * users.length)].id

      // follower_id not same as following_id
      do {
        followerId = users[Math.floor(Math.random() * users.length)].id
      } while (followerId === followingId)

      followships.push({
        following_id: followingId,
        follower_id: followerId,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    await queryInterface.bulkInsert('Followships', followships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  },
}
