'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const tweetsArr = []
    users.forEach(user => {
      for (let i = 0; i < 10; i++) {
        tweetsArr.push({
          UserId: user.id,
          description: faker.lorem.text().substring(0, 130),
          createdAt: faker.date.recent(),
          updatedAt: new Date()
        })
      }
    })

    await queryInterface.bulkInsert('Tweets', tweetsArr, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
