'use strict'
const faker = require('faker')
const bcrypt = require('bcrypt-nodejs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 12 }, (_, i) => ({
        account: i ? `user${i}` : 'root',
        email: i ? `user${i}@example.com` : 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: i ? `user${i}` : 'root',
        avatar: `https://loremflickr.com/320/240/paris,girl/?random=${Math.random()*100}`,
        introduction: faker.lorem.sentences(2, '\n'),
        role: i ? 'user' : 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}