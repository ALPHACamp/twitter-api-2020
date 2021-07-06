'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tweets', [{
      UserId: 2,
      description: 'user1的推文',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      UserId: 3,
      description: 'user2的推文',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {});
  }
};
