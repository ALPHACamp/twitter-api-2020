'use strict';
const faker = require('faker')
const bcrypt = require('bcrypt-nodejs')


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      Array.from({ length: 6 }).map((user, i) => ({
        id: i == 1 ? i : (i * 10 + 1),
        account: i == 1 ? 'root' : 'user' + (i - 1),
        email: i == 1 ? 'root@example.com' : `user${i - 1}@example.com`,
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: faker.name.findName(),
        avatar: `https://loremflickr.com/320/240/selfie?lock=${i}`,
        introduction: faker.lorem.text().substring(0, 160),
        role: i == 1 ? 'admin' : 'user',
        cover: `https://loremflickr.com/400/300/landscape?lock=${i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
