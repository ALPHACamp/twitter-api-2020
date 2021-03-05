'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes', [
      {
        id: 1,
        UserId: 1,
        TweetId: 11,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 11,
        UserId: 1,
        TweetId: 61,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 21,
        UserId: 21,
        TweetId: 31,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 31,
        UserId: 21,
        TweetId: 51,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 41,
        UserId: 11,
        TweetId: 51,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 61,
        UserId: 21,
        TweetId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 71,
        UserId: 11,
        TweetId: 21,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
