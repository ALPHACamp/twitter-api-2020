'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    
    const followships = Array.from({ length: 30 }, () => {
      let FollowerId = users[Math.floor(Math.random() * users.length)].id
      let FollowingId = users[Math.floor(Math.random() * users.length)].id
      
      while (FollowerId === FollowingId) {
        FollowerId = users[Math.floor(Math.random() * users.length)].id
        FollowingId = users[Math.floor(Math.random() * users.length)].id
      }
      
      return {
        FollowerId,
        FollowingId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    await queryInterface.bulkInsert('Followships', followships, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
