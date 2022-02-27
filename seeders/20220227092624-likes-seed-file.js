'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const likesNum = 3
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: tweets.length }, (_, i) => ({
        createdAt: new Date(),
        updatedAt: new Date(),
        TweetId: tweets[Math.floor(i / likesNum)].id,
        UserId: users[Math.floor(Math.random() * users.length)].id,
        isDeleted: false
      }))
    )
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
