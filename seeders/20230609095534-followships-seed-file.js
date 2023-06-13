'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role <> 'admin'",
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    const followships = []
    let counts = 0
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        followships.push(
          {
            followerId: users[i].id,
            followingId: users[j].id,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        )
        counts++
        if (counts === 10) {
          break
        }
      }
    }
    await queryInterface.bulkInsert('Followships', followships)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
