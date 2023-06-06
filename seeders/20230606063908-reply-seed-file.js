'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const repliesData = []
      for (let j = 0; j < tweets.length; j++) {
        for (let i = 1; i < 4; i++) {
          const replyData = {
            User_id: users[Math.floor(Math.random() * users.length)].id,
            Tweet_id: tweets[j].id,
            comment: `你好棒${i}`,
            created_at: new Date(),
            updated_at: new Date()
          }
          repliesData.push(replyData)
        }
      }
    await queryInterface.bulkInsert('Replies', repliesData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
};
