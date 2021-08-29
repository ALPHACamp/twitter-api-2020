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
      cover: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80',
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
      cover: 'https://images.unsplash.com/photo-1507608158173-1dcec673a2e5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
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
      cover: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1934&q=80',
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
      cover: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
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
      cover: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
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
      cover: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
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
      cover: 'https://images.unsplash.com/photo-1530543787849-128d94430c6b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
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
      cover: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    },
    {
      id: 10,
      email: 'elonmusk@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'Elon Mark',
      account: 'elonmark',
      introduction: faker.lorem.text().substring(0, 160),
      avatar: 'https://i.pravatar.cc/150?img=33',
      cover: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      role: 'user',
      createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
      updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
    },
    {
      id: 11,
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: 'root',
      account: 'root',
      avatar: 'https://i.pravatar.cc/150?img=31',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
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
