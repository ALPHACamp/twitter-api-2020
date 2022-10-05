'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    queryInterface.bulkInsert('Followships', Array.from({ length: users.length }, (_, i) => ({
      follower_id: users[i].id,
      following_id: users?.filter(u => u.id !== users[i].id)[Math.floor(Math.random() * (users.length - 2))]?.id,
      created_at: new Date(),
      updated_at: new Date()
    }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
}
