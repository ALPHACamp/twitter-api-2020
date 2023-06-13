'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 6 }, (v, i) => ({
        follower_id: users[i].id,
        following_id: users[5 - i].id,
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}