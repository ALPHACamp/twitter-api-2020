'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'root',
      account: 'root',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user1',
      account: 'user1',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.random() * 100}`,
      cover_photo: '',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: faker.name.findName(),
      account: 'user2',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.random() * 100}`,
      cover_photo: '',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: faker.name.findName(),
      account: 'user3',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.random() * 100}`,
      cover_photo: '',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: faker.name.findName(),
      account: 'user4',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.random() * 100}`,
      cover_photo: '',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: faker.name.findName(),
      account: 'user5',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.random() * 100}`,
      cover_photo: '',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user6@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: faker.name.findName(),
      account: 'user6',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.random() * 100}`,
      cover_photo: '',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'darren@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'Darren',
      account: 'darren',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.random() * 100}`,
      cover_photo: '',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'alley@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'Alley',
      account: 'alley',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.random() * 100}`,
      cover_photo: '',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'penny@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'Penny',
      account: 'penny',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.random() * 100}`,
      cover_photo: '',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'david@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'David',
      account: 'david',
      avatar: `https://loremflickr.com/320/240/boy,girl/?random=${Math.random() * 100}`,
      cover_photo: '',
      introduction: faker.lorem.text(),
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
