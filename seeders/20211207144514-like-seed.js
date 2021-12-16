'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Likes', [{
      TweetId: 1000,
      UserId: 10,
      isLike: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      TweetId: 900,
      UserId: 20,
      isLike: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      TweetId: 800,
      UserId: 30,
      isLike: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      TweetId: 700,
      UserId: 40,
      isLike: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      TweetId: 600,
      UserId: 50,
      isLike: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      TweetId: 500,
      UserId: 60,
      isLike: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      TweetId: 400,
      UserId: 70,
      isLike: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      TweetId: 300,
      UserId: 80,
      isLike: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      TweetId: 200,
      UserId: 90,
      isLike: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      TweetId: 120,
      UserId: 10,
      isLike: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Likes', null, {});
  }
};
