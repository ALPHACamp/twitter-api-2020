'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT * FROM Users WHERE role = ?',
      { replacements: ['user'],
        type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT * FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 150 }, (num, i) => ({
        UserId: users[Math.floor(Math.random() * users.length)].id,
        TweetId: tweets[Math.floor(Math.random() * tweets.length)].id,
        comment:faker.lorem.text().substring(0, 50),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
};
