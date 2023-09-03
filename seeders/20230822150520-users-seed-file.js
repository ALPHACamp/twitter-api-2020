'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.pravatar.cc/300?img=60',
      cover: 'https://picsum.photos/id/60/747/200',
      role: 'admin',
      introduction: faker.lorem.text().substring(0, 160),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user1',
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.pravatar.cc/300?img=61',
      cover: 'https://picsum.photos/id/61/747/200',
      role: 'user',
      introduction: faker.lorem.text().substring(0, 160),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user2',
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.pravatar.cc/300?img=62',
      cover: 'https://picsum.photos/id/62/747/200',
      role: 'user',
      introduction: faker.lorem.text().substring(0, 160),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user3',
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.pravatar.cc/300?img=63',
      cover: 'https://picsum.photos/id/63/747/200',
      role: 'user',
      introduction: faker.lorem.text().substring(0, 160),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user4',
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.pravatar.cc/300?img=64',
      cover: 'https://picsum.photos/id/64/747/200',
      role: 'user',
      introduction: faker.lorem.text().substring(0, 160),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user5',
      account: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      avatar: 'https://i.pravatar.cc/300?img=65',
      cover: 'https://picsum.photos/id/65/747/200',
      role: 'user',
      introduction: faker.lorem.text().substring(0, 160),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
