'use strict'
const { getDate } = require('../_helpers')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE id > (SELECT MIN(id) FROM Users);',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const likesCheck = new Set()
    const likesArray = []

    while (likesArray.length <= 50) {
      let tweetId = tweets[Math.floor(Math.random() * tweets.length)].id
      const userId = users[Math.floor(Math.random() * users.length)].id
      while (likesCheck.has(`${tweetId}-${userId}`)) {
        tweetId = tweets[Math.floor(Math.random() * tweets.length)].id
      }
      likesCheck.add(`${tweetId}-${userId}`)
      likesArray.push({
        Tweet_Id: tweetId,
        User_Id: userId,
        created_at: getDate(),
        updated_at: getDate()
      })
    }
    await queryInterface.bulkInsert('Likes', likesArray)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
