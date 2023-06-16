
'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      //先過濾掉role=admin, 只留下純users
      "SELECT id FROM Users WHERE role <> 'admin'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets ORDER BY id',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const replies = []
    const maxLength = 20
    for (let i = 0; i < tweets.length; i++) {
      for (let j = 0; j < 3; j++) {
        let randomText = faker.lorem.text(140)
        if (randomText.length > maxLength) {
          randomText = randomText.substring(0, maxLength)
        }
        replies.push({
          UserId: users[Math.floor(Math.random() * users.length)].id,
          TweetId: tweets[i].id,
          comment: randomText,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}