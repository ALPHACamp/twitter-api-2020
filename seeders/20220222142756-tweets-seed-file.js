'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminId = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role="admin";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // assign 10 tweets for each non-admin users
    for (let u of users) {
      if (!adminId.some(a => a.id === u.id)) {
        await queryInterface.bulkInsert('Tweets',
          Array.from({ length: 10 }, () => ({
            UserId: u.id,
            description: faker.lorem.text().substring(0, 100),
            image: 'https://loremflickr.com/320/240/nature?random=100',
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        )
      }
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}
