'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role = 'user';", { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert('Followships', Array.from({ length: 20 }, (_, index) => ({
      created_at: new Date(),
      updated_at: new Date(),
      following_id: users[4 - index % 5].id,
      follower_id: users[index % 5].id
    })))
    await queryInterface.sequelize.query('DELETE FROM followships WHERE following_id = follower_id;', { type: queryInterface.sequelize.QueryTypes.DELETE })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('followships', null, {})
  }
}
