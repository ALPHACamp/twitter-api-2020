'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Followships', [{
      followerId: 10,
      followingId: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 10,
      followingId: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 10,
      followingId: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 20,
      followingId: 40,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 20,
      followingId: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 20,
      followingId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 30,
      followingId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 30,
      followingId: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 30,
      followingId: 40,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 40,
      followingId: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 40,
      followingId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 40,
      followingId: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 50,
      followingId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 50,
      followingId: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 50,
      followingId: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Followships', null, {});
  }
};
