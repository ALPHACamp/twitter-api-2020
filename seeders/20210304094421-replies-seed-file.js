'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies', [
      {
        id: 1,
        UserId: 21,
        TweetId: 1,
        comment: '請假請起來！',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 11,
        UserId: 11,
        TweetId: 1,
        comment: '走！',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 21,
        UserId: 1,
        TweetId: 11,
        comment: 'hello',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 31,
        UserId: 21,
        TweetId: 11,
        comment: 'aloha',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 41,
        UserId: 1,
        TweetId: 21,
        comment: '超大！！',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 51,
        UserId: 11,
        TweetId: 31,
        comment: '簡短',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 61,
        UserId: 21,
        TweetId: 31,
        comment: '留長',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 71,
        UserId: 1,
        TweetId: 51,
        comment: '水餃',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 81,
        UserId: 11,
        TweetId: 51,
        comment: 'pizza',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        id: 91,
        UserId: 1,
        TweetId: 61,
        comment: '+1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
