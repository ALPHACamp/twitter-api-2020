'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 6 }, (v, i) => ({
        createdAt: new Date(),
        updatedAt: new Date(),
        followerId: users[i].id,
        followingId: users[5 - i].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}