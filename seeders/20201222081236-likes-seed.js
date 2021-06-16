'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 150 }).map((item, index) =>
      ({
        id: index * 10 + 1,
        UserId: Math.floor(Math.random() * 10) + 2,
        TweetId: (Math.floor(Math.random() * 11) * 10 + 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
