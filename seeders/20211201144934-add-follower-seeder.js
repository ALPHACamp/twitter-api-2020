'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Followships', [{
      id: 1,
      followerId: 11,
      followingId: 21,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      followerId: 11,
      followingId: 31,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      followerId: 21,
      followingId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      followerId: 31,
      followingId: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 5,
      followerId: 11,
      followingId: 41,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', null, {})
  }
};
