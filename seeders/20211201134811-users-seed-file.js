const faker = require('faker')

;('use strict')
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          account: 'root',
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: 'admin',
          name: 'root',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user1',
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user1',
          introduction: faker.lorem.text().substring(0, 30),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user2',
          email: 'user2@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user2',
          introduction: faker.lorem.text().substring(0, 30),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user3',
          email: 'user3@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user3',
          introduction: faker.lorem.text().substring(0, 30),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user4',
          email: 'user4@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user4',
          introduction: faker.lorem.text().substring(0, 30),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user5',
          email: 'user5@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user5',
          introduction: faker.lorem.text().substring(0, 30),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
