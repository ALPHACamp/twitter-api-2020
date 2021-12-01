'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          account: 'admin',
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'root',
          avatar: `https://i.pravatar.cc/150?u=${
            Math.ceil(Math.random()) * 10
          }`,
          cover: `https://loremflickr.com/600/240/landscape/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.sentence().substring(0, 160),
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user1',
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user1',
          avatar: `https://i.pravatar.cc/150?u=${
            Math.ceil(Math.random()) * 10 + 10
          }`,
          cover: `https://loremflickr.com/320/240/landscape/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.sentence().substring(0, 160),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user2',
          email: 'user2@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user2',
          avatar: `https://i.pravatar.cc/150?u=${
            Math.ceil(Math.random()) * 10 + 20
          }`,
          cover: `https://loremflickr.com/320/240/landscape/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.sentence().substring(0, 160),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user3',
          email: 'user3@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user3',
          avatar: `https://i.pravatar.cc/150?u=${
            Math.ceil(Math.random()) * 10 + 30
          }`,
          cover: `https://loremflickr.com/320/240/landscape/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.sentence().substring(0, 160),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user4',
          email: 'user4@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user4',
          avatar: `https://i.pravatar.cc/150?u=${
            Math.ceil(Math.random()) * 10 + 40
          }`,
          cover: `https://loremflickr.com/320/240/landscape/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.sentence().substring(0, 160),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          account: 'user5',
          email: 'user5@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          name: 'user5',
          avatar: `https://i.pravatar.cc/150?u=${
            Math.ceil(Math.random()) * 10 + 50
          }`,
          cover: `https://loremflickr.com/320/240/landscape/?random=${
            Math.random() * 100
          }`,
          introduction: faker.lorem.sentence().substring(0, 160),
          role: 'user',
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
