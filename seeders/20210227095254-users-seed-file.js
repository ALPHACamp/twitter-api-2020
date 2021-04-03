'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = '12345678'
    await queryInterface.bulkInsert('Users', [
      {
        id : 1,
        account: 'root@example.com',
        email: 'root@example.com',
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        name: 'Jackson',
        avatar: faker.image.people(),
        cover: faker.image.nature(),
        introduction: 'I am Jackson.',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...(Array.from({ length: 15 }).map((_, i) => 
        ({
          id: 10 * (i + 1) + 1,
          account: `user${i + 1}@example.com`,
          email: `user${i + 1}@example.com`,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          name: `Johnny${i + 1}`,
          avatar: faker.image.people(),
          cover: faker.image.nature(),
          introduction: `I am Johnny${i + 1}`,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ))
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
  }
};
