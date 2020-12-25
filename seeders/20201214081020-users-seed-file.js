'use strict';
const bcrypt = require('bcrypt-nodejs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        account: '@root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'root',
        avatar: 'https://developers.google.com/web/tools/chrome-user-experience-report/images/logo.png',
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Root.',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        account: '@user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user1',
        avatar: `https://static.wikia.nocookie.net/despicableme/images/1/1d/Kevin_minions.png/revision/latest/top-crop/width/360/height/450?cb=20170703052012`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        account: '@user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user2',
        avatar: `https://i.pinimg.com/originals/80/90/cd/8090cde5081061b8022322953891e610.jpg`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        account: '@user3',
        email: 'user3@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user3',
        avatar: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTME5eKD8BxsZwD8zAKQKT3jh6LJxvkLPRccA&usqp=CAU`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        account: '@user4',
        email: 'user4@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user4',
        avatar: `https://i.pinimg.com/600x315/25/f8/da/25f8da5300747f8f149632f0a1261561.jpg`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        account: '@user5',
        email: 'user5@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user5',
        avatar: `https://i.pinimg.com/236x/17/d9/40/17d9400aa42488dc4de693d7eeb935d7--girl-minion-a-minion.jpg`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        account: '@user6',
        email: 'user6@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user6',
        avatar: `https://i.pinimg.com/originals/e9/a3/ec/e9a3ecf84a436535bbc37f4d03573e51.jpg`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        account: '@user7',
        email: 'user7@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user7',
        avatar: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs7orTOlG0WLKWEi3uzWyMbZha5nMndSKFHA&usqp=CAU`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        account: '@user8',
        email: 'user8@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user8',
        avatar: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQBT1-ta5hf_yCOYbTAnJxbcFxl399kwqqRw&usqp=CAU`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        account: '@user9',
        email: 'user9@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user9',
        avatar: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDJGTp-iC6PCk6XEv2PkItQuqjhycgSrV8ig&usqp=CAU`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        account: '@user10',
        email: 'user10@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        name: 'user10',
        avatar: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH6z7Ede8PQHOsdwQSLubIismEddqpzMmh1g&usqp=CAU`,
        cover: 'https://m.dw.com/image/48396304_101.jpg',
        introduction: 'I am Groot.',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
