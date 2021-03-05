'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (let i = 1; i <= 5; i++) {
      await queryInterface.bulkInsert('Likes',
        Array.from({ length: 10 }).map((_, index) =>
        ({
          UserId: i,
          TweetId: index + 1 + i,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {})
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
