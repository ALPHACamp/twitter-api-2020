'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.bulkInsert('Users', [
     {
       email: 'root@example.com',
       password: await bcrypt.hash('12345678', 10),
       name: 'root',
       avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
       introduction: "introdution",
       role: 'admin',
       created_at: new Date(),
       updated_at: new Date()
     }, {
       email: 'user1@example.com',
       password: await bcrypt.hash('12345678', 10),
       name: 'user1',
       avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
       introduction: "introdution",
       created_at: new Date(),
       updated_at: new Date()
     }
   ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
};
