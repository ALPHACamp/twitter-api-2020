'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      // 管理者root
      account: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'admin',
      name: 'root',
      avatar: 'https://i.imgur.com/HD4yT2V.png',
      introduction: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique ipsam dolorem voluptatem ipsum, vero laboriosam?',
      createdAt: new Date(),
      updatedAt: new Date(),
      banner: 'https://i.imgur.com/bW0IDLD.png'
    }, {
      // 使用者 user1
      account: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user1',
      avatar: 'https://i.imgur.com/HD4yT2V.png',
      introduction: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique ipsam dolorem voluptatem ipsum, vero laboriosam?',
      createdAt: new Date(),
      updatedAt: new Date(),
      banner: 'https://i.imgur.com/bW0IDLD.png'
    }, {
      // 使用者 user2
      account: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user2',
      avatar: 'https://i.imgur.com/HD4yT2V.png',
      introduction: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique ipsam dolorem voluptatem ipsum, vero laboriosam?',
      createdAt: new Date(),
      updatedAt: new Date(),
      banner: 'https://i.imgur.com/bW0IDLD.png'
    }, {
      // 使用者 user3
      account: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user3',
      avatar: 'https://i.imgur.com/HD4yT2V.png',
      introduction: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique ipsam dolorem voluptatem ipsum, vero laboriosam?',
      createdAt: new Date(),
      updatedAt: new Date(),
      banner: 'https://i.imgur.com/bW0IDLD.png'
    }, {
      // 使用者 user4
      account: 'user4',
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user4',
      avatar: 'https://i.imgur.com/HD4yT2V.png',
      introduction: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique ipsam dolorem voluptatem ipsum, vero laboriosam?',
      createdAt: new Date(),
      updatedAt: new Date(),
      banner: 'https://i.imgur.com/bW0IDLD.png'
    }, {
      // 使用者 user5
      account: 'user5',
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'user',
      name: 'user5',
      avatar: 'https://i.imgur.com/HD4yT2V.png',
      introduction: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique ipsam dolorem voluptatem ipsum, vero laboriosam?',
      createdAt: new Date(),
      updatedAt: new Date(),
      banner: 'https://i.imgur.com/bW0IDLD.png'
    }], {})
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
