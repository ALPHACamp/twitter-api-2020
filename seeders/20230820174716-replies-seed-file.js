'use strict';

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT * FROM Users WHERE role = 'user';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT * FROM `Tweets`;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    let list = []
    for (let i in tweets) {
      for (let j = 0; j < 3; j++) {
        list.push(tweets[i].id)
      }
    }
    await queryInterface.bulkInsert('replies',
      Array.from({ length: tweets.length * 3 }, (_, index) => ({
        userId: users[Math.floor(Math.random() * users.length)].id,
        tweetId: list[index],
        comment: faker.lorem.text(),
        createAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('replies', {})
  }
};
