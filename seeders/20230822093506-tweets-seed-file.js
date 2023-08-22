'use strict'
const NumOfTweetPerUser = 10 // 每個User隨機產生Tweet數

const { QueryTypes } = require('sequelize')
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取出所有user id存於陣列
    const users = await queryInterface.sequelize.query("SELECT id FROM Users where `role`='user'", { type: QueryTypes.SELECT })
    const userIds = users.map(user => user.id)

    // 每一個user隨機產生tweets
    const tweets = []
    for (let i = 0; i < userIds.length; i++) {
      for (let j = 0; j < NumOfTweetPerUser; j++) {
        tweets.push({
          UserId: userIds[i],
          description: faker.lorem.paragraph({ min: 1, max: 3 }).substring(0, 140),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Tweets', tweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
