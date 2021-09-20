'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('likes',
      Array.from({ length: 80 }).map((item, index) =>
      ({
        UserId: Math.floor(Math.random() * 6),
        TweetId: Math.floor(Math.random() * 50),
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
