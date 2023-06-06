'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    for (let i = 0; i < 5; i++) {
      await queryInterface.bulkInsert('Tweets', Array.from({ length: 10 }, (_, index) => ({
        User_id: users[i].id,
        description: `這是我的第${index + 1}篇推文，好爽，耶嘿！`,
        likable: true,
        commendable: true,
        created_at: new Date(),
        updated_at: new Date()
      })))
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
};
