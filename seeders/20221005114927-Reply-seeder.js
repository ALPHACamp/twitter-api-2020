'use strict';

const faker = require('faker')
const dayJs = require("dayjs")
const dayJsRandom = require("dayjs-random")
dayJs.extend(dayJsRandom)
module.exports = {
  up: async(queryInterface, Sequelize) => {
    try{
    const user = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = "user"; ',
      { type: queryInterface.sequelize.QueryTypes.SELECT })

    const tweet =  await queryInterface.sequelize.query(
      'SELECT id FROM Tweets ; ',
      { type: queryInterface.sequelize.QueryTypes.SELECT })

      await queryInterface.bulkInsert('Replies' ,replyGenerate(user,tweet,3) )
    }catch(error){
      console.log(error)
    }
  },

  down: async(queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('Replies' , {})
  }
};

function replyGenerate(user,tweet, NumberOfReplyPerTweet){
  let result = []
  for (let i = 0 ; i < tweet.length ; i++){
    for(let y = 0 ; y < NumberOfReplyPerTweet ; y++){
      result.push({
        UserId:user[Math.floor( Math.random()*user.length)].id,
        TweetId:tweet[i].id,
        comment:faker.lorem.text(),
        createdAt: dayJs.between('2022-10-05', '2022-11-05').format('YYYY-MM-DD HH:MM:ss'),
        updatedAt: new Date()
      })
    }
  }
  return result
}