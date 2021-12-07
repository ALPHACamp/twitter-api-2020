'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Followships', [{
      followerId: 1,
      followingId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 1,
      followingId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 1,
      followingId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 2,
      followingId: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 2,
      followingId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 2,
      followingId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 3,
      followingId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 3,
      followingId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 3,
      followingId: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 4,
      followingId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 4,
      followingId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 4,
      followingId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 5,
      followingId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 5,
      followingId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 5,
      followingId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Followships', null, {});
  }
};
