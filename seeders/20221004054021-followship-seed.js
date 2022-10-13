'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const followArray = []
    users.forEach(user => {
      users.map(following => {
        if (following.id > user.id) {
          followArray.push({
            follower_id: user.id,
            following_id: following.id,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      })
    })
    console.log(followArray)
    queryInterface.bulkInsert('Followships', followArray)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
