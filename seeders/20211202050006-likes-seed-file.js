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
      UserId: 21,
      TweetId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      UserId: 31,
      TweetId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 5,
      UserId: 11,
      TweetId: 41,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
