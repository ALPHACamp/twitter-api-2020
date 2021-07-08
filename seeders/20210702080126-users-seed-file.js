'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'root',
        account: 'root',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'user1',
        account: 'user1',
        role: 'user',
        avatar: 'https://image.flaticon.com/icons/png/512/847/847969.png',
        cover: 'https://images.unsplash.com/27/perspective.jpg?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'user2',
        account: 'user2',
        role: 'user',
        avatar: 'https://image.flaticon.com/icons/png/512/763/763704.png',
        cover: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'user3',
        account: 'user3',
        role: 'user',
        avatar: 'https://image.flaticon.com/icons/png/512/763/763704.png',
        cover: 'https://images.unsplash.com/photo-1567261585152-02a94eeda80a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1190&q=80',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'user4',
        account: 'user4',
        role: 'user',
        avatar: 'https://image.flaticon.com/icons/png/512/847/847969.png',
        cover: 'https://images.unsplash.com/photo-1621328895567-f909e923c9d1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', 10),
        name: 'user5',
        account: 'user5',
        role: 'user',
        avatar: 'https://image.flaticon.com/icons/png/512/528/528098.png',
        cover: 'https://images.unsplash.com/photo-1621328895567-f909e923c9d1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, { truncate: true, restartIdentity: true })
  }
}
