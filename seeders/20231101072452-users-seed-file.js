'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'root',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'root',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user1',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user1',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user2',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user2',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user3@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user3',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user3',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user4@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user4',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user4',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user5@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user5',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user5',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user6@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user6',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user6',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user7@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user7',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user7',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user8@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user8',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user8',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user9@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user9',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user9',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user10@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user10',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user10',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user11@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user11',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user11',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user12@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user12',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user12',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user13@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user13',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user13',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user14@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user14',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user14',
          cover: 'https://i.imgur.com/JJozKMp.png'
        },
        {
          email: 'user15@example.com',
          password: await bcrypt.hash('12345678', 10),
          name: 'user15',
          avatar: faker.image.avatar(),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          account: 'user15',
          cover: 'https://i.imgur.com/JJozKMp.png'
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
