'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const replyData = [];
    for (let i = 0; i < tweets.length; i++) {
      let userIdCheck = []
      for (let j = 0; j < 3; j++) {
        let userId = users[Math.floor(Math.random() * (users.length - 1)) + 1].id
        if (userIdCheck.indexOf(userId) === -1) {
          userIdCheck.push(userId)
        } else {
          --j   //not use j-- , data wll not complete
          break
        }

        const newReply = {
          UserId: userIdCheck[j],
          TweetId: tweets[i].id,
          comment: faker.lorem.text().substring(0, 60),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        replyData.push(newReply);
      }
    }
    await queryInterface.bulkInsert('Replies', replyData);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}