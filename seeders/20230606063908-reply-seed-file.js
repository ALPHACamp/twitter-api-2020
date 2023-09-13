'use strict'
const { getDate } = require('../_helpers')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE id > (SELECT MIN(id) FROM Users);',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const repliesData = []
    const getRandomUsers = (users, count) => {
      const randomUsers = []
      while (randomUsers.length < count) {
        const randomIndex = Math.floor(Math.random() * users.length)
        const randomUser = users[randomIndex]
        if (!randomUsers.includes(randomUser)) {
          randomUsers.push(randomUser)
        }
      }
      return randomUsers
    }
    const dateArray = getDate(150)
    for (let j = 0; j < tweets.length; j++) {
      const randomUsers = getRandomUsers(users, 3)
      for (let i = 0; i < 3; i++) {
        const replyData = {
          User_id: randomUsers[i].id,
          Tweet_id: tweets[j].id,
          comment: `你好棒${i + 1}`,
          created_at: dateArray[j * 3 + i],
          updated_at: dateArray[j * 3 + i]
        }
        repliesData.push(replyData)
      }
    }
    await queryInterface.bulkInsert('Replies', repliesData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
