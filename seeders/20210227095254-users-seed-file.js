'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = '12345678'
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        name: 'root',
        avatar: null,
        introduction: 'I am Jackson',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...(Array.from({ length: 5 }).map((_, i) => 
        ({
          email: `user${i}@example.com`,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          name: `Johnny${i}`,
          avatar: null,
          introduction: `I am Johnny${i}`,
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
