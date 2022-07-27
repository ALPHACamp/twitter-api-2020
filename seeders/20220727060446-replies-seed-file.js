'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies', [
      {
        user_id: 1,
        tweet_id: 2,
        comment: 'c1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        tweet_id: 2,
        comment: 'c2',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        tweet_id: 2,
        comment: 'c3',
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
};
