'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
        const otherUsers = Array.from({ length: 4 }, () => ({
            account: faker.lorem.word(10),
            email: faker.internet.email(),
            password: bcrypt.hashSync(faker.internet.password(20),10),
            name: faker.name.findName(),
            avatar: `https://loremflickr.com/140/140/people/?random=${Math.random() * 100}`,
            introduction:faker.lorem.text(),
            cover:`https://loremflickr.com/639/200/image?random=${Math.random() * 100}`,
            role:0,
            following_count:Math.floor(Math.random()*500),
            created_at: faker.datatype.datetime({ min: 1577836800000, max: 1623456000000 }),
            updated_at: faker.datatype.datetime({ min: 1637836800000, max: 1663456000000 })
        }))
    await queryInterface.bulkInsert('Users',otherUsers)
  },
  down: async (queryInterface, Sequelize) => {
    const { sequelize } = queryInterface
    try {
      await sequelize.transaction(async (transaction) => {
        const options = { transaction }
        await sequelize.query("TRUNCATE TABLE Users", options)
      })
    } catch (error) {
      console.log(error);
    }
}
}