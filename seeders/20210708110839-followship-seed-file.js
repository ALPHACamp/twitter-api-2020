'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Followships',
      [
        {
          followerId: 10,
          followingId: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 10,
          followingId: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 15,
          followingId: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 15,
          followingId: 25,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 20,
          followingId: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 20,
          followingId: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 25,
          followingId: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 25,
          followingId: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 30,
          followingId: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 30,
          followingId: 25,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Followships', null, {});
  }
};
