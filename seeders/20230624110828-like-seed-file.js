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
    // 每個 user 按隨機 3 則不重複 tweet like
    for (let i = 0; i < users.length; i++) {
      let tweetsCopy = [...tweets]
      for (let j = 0; j < 3; j++) {
        let randomIndex = Math.floor(Math.random() * tweetsCopy.length)
        likes.push({
          tweetId: tweetsCopy[randomIndex].id,
          userId: users[i].id,
          createdAt: getRandomDate(startDate, endDate),
          updatedAt: getRandomDate(startDate, endDate),
        })
        tweetsCopy.splice(randomIndex, 1)
      }
    }
    await queryInterface.bulkInsert('Likes', likes)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
};
