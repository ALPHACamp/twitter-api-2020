'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('likes',
      Array.from({ length: 80 }).map((item, index) =>
      ({
        UserId: Math.floor(Math.random() * 5) * 10 + 5,
        TweetId: Math.floor(Math.random() * index) * 10 + 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      )
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tweets', null, {})
  }
};
