'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'admin'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    
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
      const uniqueCombinations = {}
      const uniqueFollowships = []

    for (const followship of followships) {
      const combination = `${followship.FollowerId}-${followship.FollowingId}`
      
      if (!uniqueCombinations[combination]) {
        uniqueCombinations[combination] = true
        uniqueFollowships.push(followship)
      }
    }

      await queryInterface.bulkInsert('Followships', uniqueFollowships, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
