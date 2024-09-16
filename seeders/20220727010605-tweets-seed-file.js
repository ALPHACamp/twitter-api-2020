'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets', [
      {
        description: 'test',
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        description: 'test2',
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        description: 'test3',
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
};
