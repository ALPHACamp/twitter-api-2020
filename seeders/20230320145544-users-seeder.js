'use strict'

const bcrypt = require('bcryptjs')

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
