'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT * FROM Users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const list = []
    for (const i in users) {
      for (let j = 0; j < 10; j++) {
        list.push(users[i].id)
      }
    }
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: list.length }, (_, index) => ({
        userId: list[index],
        description: faker.lorem.text().substring(0, 140),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
