'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Replies',[{
      user_id: 2,
      tweet_id: 3,
      comment: 'GG',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 2,
      tweet_id: 4,
      comment: 'AA',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 3,
      tweet_id: 4,
      comment: 'BB',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 2,
      tweet_id: 5,
      comment: 'DD',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: 4,
      tweet_id: 3,
      comment: 'EE',
      created_at: new Date(),
      updated_at: new Date(),
    }
  ])},
  down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Replies', {});
  }
}
