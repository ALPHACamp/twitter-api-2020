'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tweets', [{
      id: 1,
      UserId: 1,
      description: '想放假！！！',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      UserId: 11,
      description: 'hi',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 21,
      UserId: 21,
      description: '是地震！',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 31,
      UserId: 1,
      description: '要剪短還是留長',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 41,
      UserId: 11,
      description: '求台北推薦不限時咖啡廳',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 51,
      UserId: 21,
      description: '晚餐吃什麼',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 61,
      UserId: 21,
      description: '人生好難',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
};
