'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'admin',
        name: 'root',
        account: 'root',
        avatar: 'https://t.kfs.io/upload_images/56611/alpha-logo-square-3592_original.png',
        cover: 'https://t.kfs.io/upload_images/56611/alpha-logo-square-3592_original.png',
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        name: 'user1',
        account: 'user1',
        avatar: 'https://t.kfs.io/upload_images/56611/alpha-logo-square-3592_original.png',
        cover: 'https://t.kfs.io/upload_images/56611/alpha-logo-square-3592_original.png',
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        name: 'user2',
        account: 'user2',
        avatar: 'https://t.kfs.io/upload_images/56611/alpha-logo-square-3592_original.png',
        cover: 'https://t.kfs.io/upload_images/56611/alpha-logo-square-3592_original.png',
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user3@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        name: 'user3',
        account: 'user3',
        avatar: 'https://t.kfs.io/upload_images/56611/alpha-logo-square-3592_original.png',
        cover: 'https://t.kfs.io/upload_images/56611/alpha-logo-square-3592_original.png',
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user4@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        name: 'user4',
        account: 'user4',
        avatar: 'https://t.kfs.io/upload_images/56611/alpha-logo-square-3592_original.png',
        cover: 'https://t.kfs.io/upload_images/56611/alpha-logo-square-3592_original.png',
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user5@example.com',
        password: await bcrypt.hash('12345678', 10),
        role: 'user',
        name: 'user5',
        account: 'user5',
        avatar: 'https://t.kfs.io/upload_images/56611/alpha-logo-square-3592_original.png',
        cover: 'https://t.kfs.io/upload_images/56611/alpha-logo-square-3592_original.png',
        introduction: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Users', {})
    await queryInterface.sequelize.query('ALTER TABLE Users AUTO_INCREMENT = 1')
  }
}
