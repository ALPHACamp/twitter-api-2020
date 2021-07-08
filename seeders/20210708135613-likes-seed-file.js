'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 25 }).map((item, index) => ({
        id: index + 1,
        UserId: Math.ceil(Math.random() * 5),
        TweetId: Math.ceil(Math.random() * 50),
        createdAt: functions.randomDate(new Date(2021, 0, 1), new Date()),
        updatedAt: functions.randomDate(new Date(2021, 0, 1), new Date())
      })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', null, {})
  }
};
