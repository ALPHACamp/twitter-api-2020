'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes', [{
      id: 1,
      UserId: 11,
      TweetId: 21,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      UserId: 11,
      TweetId: 31,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      UserId: 11,
      TweetId: 41,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      UserId: 11,
      TweetId: 51,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 5,
      UserId: 21,
      TweetId: 21,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 6,
      UserId: 21,
      TweetId: 31,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 7,
      UserId: 21,
      TweetId: 41,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 8,
      UserId: 31,
      TweetId: 31,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 9,
      UserId: 31,
      TweetId: 41,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 10,
      UserId: 41,
      TweetId: 51,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: 11,
      UserId: 51,
      TweetId: 41,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};