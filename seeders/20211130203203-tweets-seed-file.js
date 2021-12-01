'use strict';
const faker = require('faker')
let userIdArray = []  // [{UserId: 1}, {UserId: 1}, ..., {UserId: 2}...]
for (let i = 1; i <= 5; i ++) {
  let oneUserIdArray = Array(10).fill({UserId: i})
  userIdArray.push(...oneUserIdArray)
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 方法一：每位user的tweet數量不一，但是faker產生內容正常
    // return queryInterface.bulkInsert('Tweets', Array.from({ length: 50 }).map((d, i) => ({
    // 方法二：每位user皆有10筆tweet，但是faker產生description, date，每位使用者都一樣
    return queryInterface.bulkInsert('Tweets', 
    userIdArray.map((d, i) => (Object.assign(d, {
      description: faker.lorem.sentence().slice(0, 140),
      // UserId: Math.ceil(Math.random() * 5), //1,2,3,4,5隨機選取，不符合每位10筆的需求
      createdAt: faker.date.recent(),
      updatedAt: new Date()
      })))
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tweets', null, {})
  }
};
