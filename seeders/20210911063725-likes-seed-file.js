'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Likes',
      Array.from({ length: 150 }).map((like, index) => ({
        id: index * 10 + 5,
        userId: ((index % 5) + 1) * 10 + 5,
        tweetId: Math.floor(index / 3) * 10 + 5,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, { truncate: true })
  }
};
