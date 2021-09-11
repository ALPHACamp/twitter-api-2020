'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('followships',
      Array.from({ length: 12 }).map((item, index) =>
      ({
        followerId: (index + 2) % 6 === 1 ? 2: (index + 2) % 6,
        followingId: (index + 2) % 7 === 1 ? 3 : (index + 2) % 7,
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
