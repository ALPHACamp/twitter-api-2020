'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )

    const followshipsData = []
    for (const user of users) {
      const randomFollowing = users
        .filter(u => u.id !== user.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)

      for (const random of randomFollowing) {
        followshipsData.push({
          followerId: user.id,
          followingId: random.id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Followships', followshipsData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
