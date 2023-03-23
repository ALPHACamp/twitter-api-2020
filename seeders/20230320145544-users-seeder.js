'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const userCounts = 6 // 預設幾位seed users
    return queryInterface.bulkInsert('Users',
      Array.from({ length: userCounts }).map((_, i) => {
        if (i < 1) { // 1位admin
          return {
            account: 'root',
            email: 'root@example.com',
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
            name: 'root',
            role: 'admin',
            avatar: `https://loremflickr.com/320/240/person,mugshot/?random=${Math.random() * 100}`,
            cover: `https://loremflickr.com/320/240/landscape/?random=${Math.random() * 100}`,
            introduction: faker.lorem.sentence(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        } else { // 其餘為一般users
          return {
            account: `user${i}`,
            email: `user${i}@example.com`,
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
            name: `user${i}`,
            role: 'user',
            avatar: `https://loremflickr.com/320/240/person,mugshot/?random=${Math.random() * 100}`,
            cover: `https://loremflickr.com/320/240/landscape/?random=${Math.random() * 100}`,
            introduction: faker.lorem.sentence(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      }), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {})
  }
}
