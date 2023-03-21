'use strict';
const faker = require('faker')
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
      Array.from({ length: 150 }, (num, index) => ({
        UserId: users[ index % 5 ].id,
        TweetId: tweets[ index % 50].id,
        comment:faker.lorem.text().substring(0, 50),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
};
