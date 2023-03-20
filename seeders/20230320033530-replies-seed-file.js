'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users WHERE role='user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    const tweets = await queryInterface.sequelize.query('SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    return await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }, (_, i) => ({
        User_Id: users[Math.floor(Math.random() * users.length)].id,
        Tweet_Id: tweets[(i % tweets.length)].id,
        comment: faker.lorem.sentence(),
        created_at: new Date(),
        updated_at: new Date()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('Replies', {})
  }
}
