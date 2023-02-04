'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersId = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'user';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const seedTweets = []
    usersId.forEach(userId => {
      const seedTweet = Array.from({ length: 10 }, () => ({
        description: faker.lorem.text().substring(0, 140),
        User_id: userId.id,
        created_at: faker.datatype.datetime({ min: 1577836800000, max: 1623456000000 }),
        updated_at: faker.datatype.datetime({ min: 1637836800000, max: 1663456000000 })
      }))
      seedTweets.push(...seedTweet)
    })
    await queryInterface.bulkInsert('Tweets', seedTweets)
  },
  down: async (queryInterface, Sequelize) => {
    const { sequelize } = queryInterface
    try {
      await sequelize.transaction(async transaction => {
        const options = { transaction }
        await sequelize.query('TRUNCATE TABLE Tweets', options)
      })
    } catch (error) {
      console.log(error)
    }
  }
}
