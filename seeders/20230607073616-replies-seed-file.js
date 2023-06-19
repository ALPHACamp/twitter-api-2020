'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const replies = tweets.flatMap(tweet => {
      const shuffledUsers = users.sort(() => 0.5 - Math.random())
      return Array.from({ length: 3 }, (_, i) => ({
        UserId: shuffledUsers[i].id,
        TweetId: tweet.id,
        comment: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    })
    await queryInterface.bulkInsert('Replies', replies)
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Replies', {})
    await queryInterface.sequelize.query('ALTER TABLE Replies AUTO_INCREMENT = 1')
  }
}
