'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
    const targetArr = []
    const expectAmt = 3 // 從第一個 user 開始，希望有多少 user 會有 like 記錄
    const userAmount = (expectAmt <= users.length) ? expectAmt : users.length
    for (let j = 0; j < userAmount; j++) {
      const usedNums = []
      const likeAmountPerUser = users.length - j
      // ~~~~~~~~~~~~~~~第一個 user 有 user.length 個 like 的推文，依序遞減~~~~~~~~~~
      targetArr.push(
        ...Array.from({ length: likeAmountPerUser }, (_, i) => ({
          created_at: new Date(Date.now() + (targetArr.length + i) * 1000),
          updated_at: new Date(Date.now() + (targetArr.length + i) * 1000),
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
