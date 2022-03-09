'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_TWEET_COUNT = 10

    // 取得所有一般使用者身分的 seed user id
    const userSeeder = (await queryInterface.sequelize.query(
      'SELECT * FROM Users WHERE role = "user"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )).map(user => user.id)

    // 設定一般使用者 tweetCount
    // userSeeder.forEach(async id => {
    //   const SQL = `UPDATE Users SET tweetCount = 10 WHERE id = ${id}`
    //   await queryInterface.sequelize.query(SQL)
    // })
    await Promise.all(userSeeder.map(id => {
      const SQL = `UPDATE Users SET tweetCount = 10 WHERE id = ${id}`
      return queryInterface.sequelize.query(SQL)
    }))

    // seed user 每人都有10篇推文
    userSeeder.forEach(async id => {
      const tweetSeeder = Array.from({ length: DEFAULT_TWEET_COUNT }, () => {
        return {
          UserId: id,
          description: faker.lorem.paragraph(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      await queryInterface.bulkInsert('Tweets', tweetSeeder)
    })
  },

  down: async (queryInterface, Sequelize) => {
    // 取得所有一般使用者身分的 seed user id
    const userSeeder = (await queryInterface.sequelize.query(
      'SELECT * FROM Users WHERE role = "user"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )).map(user => user.id)

    // 設定一般使用者 tweetCount = 0
    userSeeder.forEach(async id => {
      const SQL = `UPDATE Users SET tweetCount = 0 WHERE id = ${id}`
      await queryInterface.sequelize.query(SQL)
    })

    // delete all tweets
    await queryInterface.bulkDelete('Tweets', null)
  }
}
