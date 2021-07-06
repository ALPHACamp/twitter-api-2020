'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('replies', [{
      UserId: 2,
      TweetId: 1,
      content: 'user1的回覆',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      UserId: 3,
      TweetId: 1,
      content: 'user2的回覆',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      UserId: 4,
      TweetId: 1,
      content: 'user3的回覆',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      UserId: 2,
      TweetId: 2,
      content: 'user1的回覆',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('replies', null, {});
  }
};
