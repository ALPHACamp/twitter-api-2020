'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Likes', [{
      UserId: 2,
      ContentLikedId: 4,
      TweetId: 2,
      ReplyId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      UserId: 3,
      ContentLikedId: 3,
      TweetId: 1,
      ReplyId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      UserId: 2,
      ContentLikedId: 2,
      TweetId: 2,
      ReplyId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', null, {});

  }
};
