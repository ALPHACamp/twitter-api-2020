'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const data = []
    const eachUserTweets = 10
    for (let i = 1; i < users.length; i++) {
      for (let j = 0; j < eachUserTweets; j++) {
        data.push({
          description: faker.lorem.text(),
          User_id: Number(users[i].id),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    await queryInterface.bulkInsert('Tweets', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
