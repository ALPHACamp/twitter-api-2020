'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Likes', [{
      UserId: 2,
      ContentLikedId: 4,
      isTweet: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      UserId: 3,
      ContentLikedId: 3,
      isTweet: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      UserId: 2,
      ContentLikedId: 2,
      isTweet: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', null, {});

  }
};
