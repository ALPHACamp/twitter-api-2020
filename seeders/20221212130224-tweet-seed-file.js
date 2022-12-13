'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }, (v, i) => ({
	        user_id: Math.floor(i / 10) + 1,
	        description: faker.lorem.text(),
        created_at: faker.datatype.datetime({ min: 1577836800000, max: 1623456000000 }),
        updated_at: faker.datatype.datetime({ min: 1637836800000, max: 1663456000000 })
      }))
    )
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
