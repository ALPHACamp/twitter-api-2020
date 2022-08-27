'use strict'
const faker = require('faker')
const bcrypt = require('bcryptjs')

const SEED_USER = {
  name: 'root',
  account: 'root',
  email: 'root@example.com',
  password: '12345678',
  role: 'admin',
  avatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1.jpg',
  introduction: 'I am an admin manager.',
  banner: 'https://i.pinimg.com/originals/32/36/08/323608123209203afe1f365fa929701d.jpg'
}

module.exports = {
  async up (queryInterface, Sequelize) {
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
        role: SEED_USER.role,
        avatar: SEED_USER.avatar,
        introduction: SEED_USER.introduction,
        createdAt: new Date(),
        updatedAt: new Date(),
        socketId: 'EcNIwmvjoQmUia79AAA_'
      }]
      , {})
    // 新增 5 個一般使用者 種子資料
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 5 }).map((item, index) => {
        const name = faker.name.firstName()
        const randomNum = Math.floor(Math.random() * 100 + 1)
        const avatar = `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/${randomNum}.jpg`
        const introduction = faker.lorem.sentence(5)
        const banner = 'https://i.imgur.com/wjSOQDI.png'
        return ({
          name: name,
          account: name,
          email: name + '@aa.com',
          password: bcrypt.hashSync(name, bcrypt.genSaltSync(10)),
          role: 'user',
          avatar: avatar,
          introduction: introduction,
          banner: banner,
          followersNum: 2,
          tweetsNum: 10,
          repliesNum: 30,
          likesNum: 30,
          socketId: 'EcNIwmvjoQmUia79AAA_',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      )
      , {})
    // 新增每個使用者有 10 篇 post 種子資料(5個一般 user，不含admin管理者)
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: 50 }).map((item, index) => {
        const UserId = Math.floor(index / 10) + 2 // user.id 1 是 admin管理者，第 1 個一般 user.id 從 2 開始
        const UserTweetsIndex = index % 10 + 1
        return ({
          UserId: UserId,
          description: `User: ${UserId} 的第 ${UserTweetsIndex} 篇推文`,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
    )
    // 新增每個使用者有 2 位 follower 種子資料(5個一般 user，不含admin管理者)
    await queryInterface.bulkInsert('Followships',
      Array.from({ length: 10 }).map((item, index) => {
        let followingId = 0
        let followerId = 0
        // 確保不會自己追蹤自己
        while (followingId === followerId) {
          followingId = index % 5 + 2
          followerId = ((index % 5 + 2) + (index % 2 + 1)) % 5 + 2
        }
        return ({
          followingId: followingId,
          followerId: followerId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
    )
    // 新增每篇 post 有隨機 3 個留言者，每個人有 1 則留言種子資料(5個一般 user，不含admin管理者)
    await queryInterface.bulkInsert('Replies',
      Array.from({ length: 150 }).map((item, index) => {
        const UserId = index % 5 + 2
        const TweetId = Math.floor(index / 3) + 1
        return ({
          UserId: UserId,
          TweetId: TweetId,
          comment: `User: ${UserId} 對第 ${TweetId} 篇推文的回覆`,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
    )
    // 新增每篇 post 有隨機 3 個 like 種子資料(5個一般 user，不含admin管理者)
    await queryInterface.bulkInsert('Likes',
      Array.from({ length: 150 }).map((item, index) => {
        const UserId = index % 5 + 2
        const TweetId = Math.floor(index / 3) + 1
        return ({
          UserId: UserId,
          TweetId: TweetId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
    )
    // 新增 公開聊天室 room 1
    await queryInterface.bulkInsert('Rooms',
      Array.from({ length: 1 }).map((item, index) => {
        return ({
          User1Id: 1,
          User2Id: 1,
          User1Unread: false,
          User1UnreadNum: 0,
          User2Unread: false,
          User2UnreadNum: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
    )
  },

  async down (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Tweets', null, {})
    await queryInterface.bulkDelete('Replies', null, {})
    await queryInterface.bulkDelete('Likes', null, {})
    await queryInterface.bulkDelete('Followships', null, {})
    await queryInterface.bulkDelete('Rooms', null, {})
  }
}
