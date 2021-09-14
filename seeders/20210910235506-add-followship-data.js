'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('followships',
      Array.from({ length: 20 }).map((item, index) =>
      ({
        followerId: Math.floor(Math.random() * 6),
        followingId: Math.floor(Math.random() * 7),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      )
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('followships', null, {})
  }
};
