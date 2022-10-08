
'use strict'
const faker = require('faker')
const dayJs = require('dayjs')
const dayJsRandom = require('dayjs-random')

dayJs.extend(dayJsRandom)
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const user = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )


    await queryInterface.bulkInsert('Tweets', tweetGenerate(user, 10))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', {})
  }
}

function tweetGenerate (user, NumberOfTweetPerUser) {
  const result = []
  for (let i = 0; i < user.length; i++) {
    for (let y = 0; y < NumberOfTweetPerUser; y++) {
      result.push({
        UserId: user[i].id,
        description: faker.lorem.text(),
        createdAt: dayJs
          .between('2022-10-05', '2022-11-05')
          .format('YYYY-MM-DD HH:MM:ss'),
        updatedAt: new Date()
      })
    }
  }
  return result
}

