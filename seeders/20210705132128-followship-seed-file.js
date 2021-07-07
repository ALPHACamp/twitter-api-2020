'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Followships', [{
      followingId: 3,
      followerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      followingId: 4,
      followerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      followingId: 4,
      followerId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Followships', null, {});

  }
};
