'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = []
    const rootAdmin = {
      account: 'root',
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      nickname: 'root',
      cover_img: 'https://picsum.photos/800/300',
      avatar_img: 'https://i.pravatar.cc/300',
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date()
    }
    users.push(rootAdmin)
    
    for (let i = 1; i < 6; i++) {
      const user =  {
        account: `user${i}`,
        name: faker.internet.findName(),
        email: `user${i}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        nickname: faker.internet.userName(),
        cover_img: 'https://picsum.photos/800/300',
        avatar_img: 'https://i.pravatar.cc/300',
        bio: faker.lorem.text(),
        is_admin: false,
        created_at: new Date(),
        updated_at: new Date()
      }
      users.push(user)
    }
    
    await queryInterface.bulkInsert('Users', users, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
