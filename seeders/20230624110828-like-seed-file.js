'use strict';

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
    const likes = []
    function getRandomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    let startDate = new Date(1988, 10, 3);
    let endDate = new Date();
    for (let i = 0; i < tweets.length; i++) {
      for (let j = 0; j < 3; j++) {
        likes.push({
          tweetId: tweets[i].id,
          userId: users[Math.floor(Math.random() * users.length)].id,
          createdAt: getRandomDate(startDate, endDate),
          updatedAt: getRandomDate(startDate, endDate),
        })
      }
    }
    await queryInterface.bulkInsert('Likes', likes)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
};
