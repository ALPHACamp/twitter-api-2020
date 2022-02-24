'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id, name FROM ac_twitter_workspace.users where role = 'user';", {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const insertedTweets = users.map(user => {
      return Array.from({ length: 10 }, () => ({
        UserId: user.id,
        description: `${user.name} said: ${faker.lorem.text().substring(1, 50)}`,
        createdAt: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)), // minus 10^10 milisecond from current date
        updatedAt: new Date()
      }))
    }).flat()
    await queryInterface.bulkInsert('Tweets', insertedTweets)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
