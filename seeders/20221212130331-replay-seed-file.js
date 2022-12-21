'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const REPLIES_PER_TWEET = 3
    const usersId = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweetsId = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: tweetsId.length * REPLIES_PER_TWEET }, (_, i) => ({
        comment: faker.lorem.text(),
        User_id: usersId[i % usersId.length].id,
        Tweet_id: tweetsId[Math.floor(i / REPLIES_PER_TWEET)].id,
        created_at: faker.datatype.datetime({ min: 1577836800000, max: 1623456000000 }),
        updated_at: faker.datatype.datetime({ min: 1577836800000, max: 1623456000000 })
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    const { sequelize } = queryInterface
    try {
      await sequelize.transaction(async transaction => {
        const options = { transaction }
        await sequelize.query('TRUNCATE TABLE Replies', options)
      })
    } catch (error) {
      console.log(error)
    }
  }
}
