'use strict';

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        // 5 個一般使用者
        queryInterface.bulkInsert('Users',
          Array.from({ length: 5 }).map((d, i) =>
            ({
              id: i + 2,
              name: `User${i + 1}`,
              account: `test${i + 1}`,
              email: `test${i + 1}@example.com`,
              password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
              tweetCount: 10,
              role: 0,
              createdAt: new Date(),
              updatedAt: new Date()
            })
          ), { transaction: t }),

        // 每個使用者有 10 篇 post
        queryInterface.bulkInsert('Tweets',
          Array.from({ length: 50 }).map((d, i) =>
            ({
              id: i + 1,
              UserId: Math.ceil((i + 1) / 10) + 1, // root is id 1, so start from 2
              description: faker.lorem.text().substring(0, 140), // 140 字以內
              commentCount: 3,
              createdAt: new Date(),
              updatedAt: new Date()
            })
          ), { transaction: t }),

        // 每篇 post 有隨機 3 個留言者，每個人有 1 則留言
        queryInterface.bulkInsert('Replies',
          Array.from({ length: 150 }).map((d, i) =>
            ({
              id: i + 1,
              UserId: Math.floor(Math.random() * 5) + 2,
              TweetId: Math.ceil((i + 1) / 3),
              comment: faker.lorem.text().substring(0, 140),
              createdAt: new Date(),
              updatedAt: new Date()
            })
          ), { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    // 要用 TRUNCATE，id 才會歸零
    return Promise.all([
      queryInterface.bulkDelete('Users', null, { truncate: true }),
      queryInterface.bulkDelete('Tweets', null, { truncate: true }),
      queryInterface.bulkDelete('Replies', null, { truncate: true })
    ])
  }
};
