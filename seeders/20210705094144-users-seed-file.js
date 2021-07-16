'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')
const functions = require('../config/functions')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      id: 1,
      email: 'ryan@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Ryan',
      account: 'RyanHuang',
      introduction: faker.lorem.text().substring(0, 160),
      avatar: 'https://i.pravatar.cc/150?img=68',
      cover: `https://loremflickr.com/660/240/paris/?lock=${Math.random() * 100}`,
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    }, {
      id: 2,
      email: 'lyvia@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Lyvia',
      account: 'LyviaLee',
      introduction: faker.lorem.text().substring(0, 160),
      avatar: 'https://i.pravatar.cc/150?img=29',
      cover: `https://loremflickr.com/660/240/paris/?lock=${Math.random() * 100}`,
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    }, {
      id: 3,
      email: 'aaron@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Aaron',
      account: 'AaronWang',
      introduction: faker.lorem.text().substring(0, 160),
      avatar: 'https://i.pravatar.cc/150?img=56',
      cover: `https://loremflickr.com/660/240/paris/?lock=${Math.random() * 100}`,
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    }, {
      id: 4,
      email: 'betrice@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Beatrice',
      account: 'BeatricePai',
      introduction: faker.lorem.text().substring(0, 160),
      avatar: 'https://i.pravatar.cc/150?img=28',
      cover: `https://loremflickr.com/660/240/paris/?lock=${Math.random() * 100}`,
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    }, {
      id: 5,
      email: 'tim@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Tim',
      account: 'TimChien',
      introduction: faker.lorem.text().substring(0, 160),
      avatar: 'https://i.pravatar.cc/150?img=60',
      cover: `https://loremflickr.com/660/240/restaurant,food/?lock=${Math.random() * 100}`,
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    },
    {
      id: 6,
      email: 'twitter@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Twitter',
      account: 'Twitter',
      introduction: 'what’s happening?!',
      avatar: 'https://pbs.twimg.com/profile_images/1354479643882004483/Btnfm47p_400x400.jpg',
      cover: 'https://pbs.twimg.com/profile_banners/783214/1625080505/1500x500',
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    },
    {
      id: 7,
      email: 'cnn@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'CNN Breaking News',
      account: 'cnnbrk',
      introduction: 'Breaking news from CNN Digital. Now 61M strong. Check @cnn for all things CNN, breaking and more.',
      avatar: 'https://pbs.twimg.com/profile_images/925092227667304448/fAY1HUu3_400x400.jpg',
      cover: 'https://pbs.twimg.com/profile_banners/428333/1531855520/1500x500',
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    },
    {
      id: 8,
      email: 'nytimes@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'The New York Times',
      account: 'nytimes',
      introduction: 'News tips? Share them here: http://nyti.ms/2FVHq9v',
      avatar: 'https://pbs.twimg.com/profile_images/1098244578472280064/gjkVMelR_400x400.png',
      cover: 'https://pbs.twimg.com/profile_banners/807095/1584666392/1500x500',
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    },
    {
      id: 9,
      email: 'YouTube@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'YouTube',
      account: 'YouTube',
      introduction: 'Like and subscribe.',
      avatar: 'https://pbs.twimg.com/profile_images/1415106724504109059/3Q4zmxjQ_400x400.jpg',
      cover: 'https://pbs.twimg.com/profile_banners/10228272/1626222710/1500x500',
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    },
    {
      id: 10,
      email: 'Taiwan_CDC@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'TaiwanCDC',
      account: 'Taiwan_CDC',
      introduction: 'Official Twitter account of Centers for Disease Control, ROC (Taiwan)',
      avatar: 'https://pbs.twimg.com/profile_images/819857147546595328/QfzeN-LP_400x400.jpg',
      cover: 'https://pbs.twimg.com/profile_banners/819824721537605632/1623380994/1500x500',
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    },
    {
      id: 11,
      email: 'elonmusk@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Elon Musk',
      account: 'elonmusk',
      introduction: faker.lorem.text().substring(0, 160),
      avatar: 'https://pbs.twimg.com/profile_images/1404334078388670466/DgO3WL4S_400x400.jpg',
      cover: 'https://pbs.twimg.com/profile_banners/44196397/1576183471/1500x500',
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    },
    {
      id: 12,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      account: 'root',
      avatar: 'https://i.pravatar.cc/150?img=31',
      cover: `https://loremflickr.com/660/240/paris/?lock=${Math.random() * 100}`,
      introduction: faker.lorem.text().substring(0, 160),
      role: 'admin',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
