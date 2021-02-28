'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = '12345678'
    await queryInterface.bulkInsert('Users', [
      {
        id : 1,
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
          id: 10 * (i + 1) + 1,
          email: `user${i + 1}@example.com`,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          name: `Johnny${i + 1}`,
          avatar: null,
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
