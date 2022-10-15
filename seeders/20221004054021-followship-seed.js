'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    queryInterface.bulkInsert('Followships', Array.from({ length: users.length * 3 }, (_, i) => ({
      follower_id: users[i % users.length].id,
      following_id: users?.filter(u => u.id !== this.follower_id)[Math.floor(Math.random() * (users.length - 2))]?.id,
      created_at: new Date(),
      updated_at: new Date()
    }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}