'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增以下三行，先去查詢現在 Users 的 id 有哪些
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweets = await queryInterface.sequelize.query(
      'SELECT id FROM Tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    function getRandom (usedNums) {
      const random = Math.floor(Math.random() * (tweets.length))
      return checkRandom(random, usedNums)
    }

    function checkRandom (random, usedNums) {
      if (usedNums.includes(random)) {
        getRandom(usedNums)
      }
      usedNums.push(random)
      return random
    }
    let targetArr = []
    for (let j = 0; j < users.length; j++) {
      const usedNums = []
      targetArr = targetArr.concat(
        // ~~~~~~~~~~~~~~~第一個 user 有十個 like 的推文，依序遞減~~~~~~~~~~
        Array.from({ length: 10 - j }, (_, i) => ({
          created_at: new Date(),
          updated_at: new Date(),
          user_id: users[j].id,
          tweet_id: tweets[getRandom(usedNums)].id
        }))
      )
    }

    await queryInterface.bulkInsert('Likes', targetArr)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
