'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    //每個User都有1個追蹤者
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: users.length }, (_, i) => ({
        // followerId: users[Math.floor(Math.random() * users.length)].id,
        followerId: users[i].id,
        followingId: users[Math.floor(Math.random() * users.length)].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
