'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        account: 'root',
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'root',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {})

    await queryInterface.bulkInsert('Users',
      [
        {
          account: `user1`,
          email: `user1@example.com`,
          password: await bcrypt.hash('12345678', 10),
          name: `user1`,
          role: 'user',
          avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
          cover: `https://loremflickr.com/320/240/scenery/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: faker.name.firstName(),
          email: faker.internet.email(),
          password: await bcrypt.hash('12345678', 10),
          name: faker.name.findName(),
          role: 'user',
          avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
          cover: `https://loremflickr.com/320/240/scenery/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: faker.name.firstName(),
          email: faker.internet.email(),
          password: await bcrypt.hash('12345678', 10),
          name: faker.name.findName(),
          role: 'user',
          avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
          cover: `https://loremflickr.com/320/240/scenery/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: faker.name.firstName(),
          email: faker.internet.email(),
          password: await bcrypt.hash('12345678', 10),
          name: faker.name.findName(),
          role: 'user',
          avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
          cover: `https://loremflickr.com/320/240/scenery/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          account: faker.name.firstName(),
          email: faker.internet.email(),
          password: await bcrypt.hash('12345678', 10),
          name: faker.name.findName(),
          role: 'user',
          avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
          cover: `https://loremflickr.com/320/240/scenery/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        }
        ,
        {
          account: faker.name.firstName(),
          email: faker.internet.email(),
          password: await bcrypt.hash('12345678', 10),
          name: faker.name.findName(),
          role: 'user',
          avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
          cover: `https://loremflickr.com/320/240/scenery/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        }
        ,
        {
          account: faker.name.firstName(),
          email: faker.internet.email(),
          password: await bcrypt.hash('12345678', 10),
          name: faker.name.findName(),
          role: 'user',
          avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
          cover: `https://loremflickr.com/320/240/scenery/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        }
        ,
        {
          account: faker.name.firstName(),
          email: faker.internet.email(),
          password: await bcrypt.hash('12345678', 10),
          name: faker.name.findName(),
          role: 'user',
          avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
          cover: `https://loremflickr.com/320/240/scenery/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        }
        ,
        {
          account: faker.name.firstName(),
          email: faker.internet.email(),
          password: await bcrypt.hash('12345678', 10),
          name: faker.name.findName(),
          role: 'user',
          avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
          cover: `https://loremflickr.com/320/240/scenery/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        }
        ,
        {
          account: faker.name.firstName(),
          email: faker.internet.email(),
          password: await bcrypt.hash('12345678', 10),
          name: faker.name.findName(),
          role: 'user',
          avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
          cover: `https://loremflickr.com/320/240/scenery/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        }
        ,
        {
          account: faker.name.firstName(),
          email: faker.internet.email(),
          password: await bcrypt.hash('12345678', 10),
          name: faker.name.findName(),
          role: 'user',
          avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
          cover: `https://loremflickr.com/320/240/scenery/?random=${Math.random() * 100}`,
          introduction: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        }
      ], {})

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
