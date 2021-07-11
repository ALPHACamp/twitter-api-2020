'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Followships',
      [
        {
          followerId: 15,
          followingId:25,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 15,
          followingId: 55,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 25,
          followingId: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 25,
          followingId: 45,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 35,
          followingId: 25,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 45,
          followingId: 55,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 45,
          followingId: 55,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 45,
          followingId: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 55,
          followingId: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          followerId: 55,
          followingId: 45,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Followships', null, {});
  }
};
