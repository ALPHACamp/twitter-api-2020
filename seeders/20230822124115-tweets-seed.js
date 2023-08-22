'use strict'

const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    let usersList = []
    for (let i = 1; i <= 10; i++) {
      usersList = usersList.concat(users)
    }

    await queryInterface.bulkInsert('Tweets',
      usersList.map(user => ({
        UserId: user.id,
        description: faker.string.alphanumeric({ length: { min: 1, max: 140 } }),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
