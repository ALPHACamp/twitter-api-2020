'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // find user id first and exclude admin account
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'admin'",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )
    const tweets = [] // add this variable in to table
    users.forEach(user => {
      tweets.push(
        ...Array.from({ length: 20 }, (_, i) => ({
          UserId: user.id,
          description: faker.lorem.paragraph(1).slice(0, 140),
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )
    })
    await queryInterface.bulkInsert('Tweets',
      tweets
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}
