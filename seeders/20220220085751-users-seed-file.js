'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')

const DEFAULT_PASSWORD = '12345678'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      account: 'root',
      password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
      isAdmin: true,
      role: 'admin',
      name: 'root',
      introduction: faker.lorem.text().substring(0, 160),
      cover: 'https://i.imgur.com/aWCidFh.jpeg',
      avatar: 'https://i.imgur.com/jb7dyQ4.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'user1@example.com',
      account: 'user1',
      password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user1',
      introduction: faker.lorem.text().substring(0, 160),
      cover: 'https://i.imgur.com/2MHUybP.jpeg',
      avatar: 'https://i.imgur.com/twLCVen.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'user2@example.com',
      account: 'user2',
      password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user2',
      introduction: faker.lorem.text().substring(0, 160),
      cover: 'https://i.imgur.com/9bQRQXh.jpeg',
      avatar: 'https://i.imgur.com/p5CQC07.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'user3@example.com',
      account: 'user3',
      password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user3',
      introduction: faker.lorem.text().substring(0, 160),
      cover: 'https://i.imgur.com/gcEvEDq.jpeg',
      avatar: 'https://i.imgur.com/OdItn5D.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'user4@example.com',
      account: 'user4',
      password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user4',
      introduction: faker.lorem.text().substring(0, 160),
      cover: 'https://i.imgur.com/NqEYhmH.jpeg',
      avatar: 'https://i.imgur.com/H6qDZ2P.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      email: 'user5@example.com',
      account: 'user5',
      password: await bcrypt.hash(DEFAULT_PASSWORD, 10),
      isAdmin: false,
      role: 'user',
      name: 'user5',
    introduction: faker.lorem.text().substring(0, 160),
      cover: 'https://i.imgur.com/fHWfByO.jpeg',
      avatar: 'https://i.imgur.com/dTE51VX.jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
