'use strict';
const faker = require('faker')
const bcrypt = require('bcryptjs')

const SEED_USER = {
  name: 'root',
  account: 'root',
  email: 'root@example.com',
  password: '12345678'
}

module.exports = {
  async up(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    // 新增 admin 種子資料
    await queryInterface.bulkInsert('Users',
      [{
        name: SEED_USER.name,
        account: SEED_USER.account, 
        email: SEED_USER.email,
        password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(10)),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      }]
      , {})
    // 新增 5 個一般使用者 種子資料
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 5 }).map((item, index) => {
        let name = faker.name.firstName()
        return ({
          name: name,
          account: name,
          email: name + '@aa.com',
          password: bcrypt.hashSync(name, bcrypt.genSaltSync(10)),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
      )
      , {})
    // 新增每個使用者有 10 篇 post 種子資料
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((item, index) => {
        let UserId = Math.floor(index / 10) + 2
        let UserTweetsIndex = index % 10 + 1
        return ({
          UserId: UserId,
          description: `User: ${UserId} 的第 ${UserTweetsIndex} 篇推文`,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })
    )
    // 新增每篇 post 有隨機 3 個留言者，每個人有 1 則留言 種子資料
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((item, index) => {
        let UserId = Math.floor(Math.random() * 5) + 2
        let TweetId = Math.floor(index / 3) + 1
        return ({
          UserId: UserId,
          TweetId: TweetId,
          comment: `User: ${UserId} 對第 ${TweetId} 篇推文的回覆`,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      })
    )
  },

  async down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Tweets', null, {})
    await queryInterface.bulkDelete('Replies', null, {})
  }
};
