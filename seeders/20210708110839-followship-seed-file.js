'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Followships',
      [
        {
          followerId: 2,
          followingId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 2,
          followingId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 3,
          followingId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 3,
          followingId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 4,
          followingId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 4,
          followingId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 5,
          followingId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 5,
          followingId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 6,
          followingId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 6,
          followingId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Followships', null, {});
  }
};
