'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users',
      [{
        id: '99',
        account: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        role: 'admin',
        name: 'root',
        introduction: faker.lorem.text(),
        avatar: 'https://loremflickr.com/320/240/men,women',
        cover: 'http://placeimg.com/640/480/cats',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {})
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 5 }).map((d, i) =>
        ({
          id: i + 1,
          account: 'user' + (i + 1),
          email: 'user' + (i + 1) + '@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: 'user',
          name: 'user' + (i + 1),
          introduction: faker.lorem.text(),
          avatar: 'https://loremflickr.com/320/240/men,women',
          cover: 'http://placeimg.com/640/480/cats',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
