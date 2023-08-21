'use strict';
const bcrypt = require('bcrypt')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: '南港古天樂',
      avatar: `https://images.newtalk.tw/resize_action2/800/album/news/549/604b088605df1.jpg`,
      introduction: '沒有很可以但你惹不起',
      role: 'admin',
      account: '乂瘋狂的小風乂',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: '蘇潔',
      avatar: `https://shoplineimg.com/61662e5adfa523003edf1433/617678bf07ec314aa1093009/800x.webp?source_format=png`,
      introduction: '愛用炫彩拉拉',
      role: 'user',
      account: '拉拉',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: '竹',
      avatar: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTulVFA93dDlbLUSgo6KfrPF-aX6v7uu6sihQ&usqp=CAU`,
      introduction: '',
      role: 'user',
      account: '老蔡',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user3',
      avatar: `https://i.pinimg.com/564x/c2/ed/82/c2ed82d2ea411ec74179ba290fb0a290.jpg`,
      introduction: '',
      role: 'user',
      account: 'user3',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user4',
      avatar: `https://i.pinimg.com/564x/c2/ed/82/c2ed82d2ea411ec74179ba290fb0a290.jpg`,
      introduction: '',
      role: 'user',
      account: 'user4',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      name: 'user5',
      avatar: `https://i.pinimg.com/564x/c2/ed/82/c2ed82d2ea411ec74179ba290fb0a290.jpg`,
      introduction: '',
      role: 'user',
      account: 'user5',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
};
