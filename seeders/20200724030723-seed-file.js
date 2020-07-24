'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    // one admin
    queryInterface.bulkInsert('Users', [{
      name: 'root',
      account: 'root',
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // modify seed data arguments here
    const userCounts = 5        // 5 users by default
    const tweetsEachUser = 10   // each user has 10 tweets
    const repliesEachTweet = 3  // each tweet has 3 replies

    queryInterface.bulkInsert('Users',
      Array.from({ length: userCounts }, (_, i) =>
        ({
          name: faker.name.findName(),
          account: `user${i}`,
          email: `user${i}@example.com`,
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})

    const tweetsUserIdArray = []
    for (let i = 0; i < tweetsEachUser; i++) {
      for (let j = 2; j <= userCounts + 1; j++) {
        tweetsUserIdArray.push(j)
      }
    }
    queryInterface.bulkInsert('Tweets',
      Array.from({ length: userCounts * tweetsEachUser }, (_, i) =>
        ({
          UserId: tweetsUserIdArray.shift(),
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})

    const repliesUserIdArray = []
    for (let i = 0; i < tweetsEachUser * repliesEachTweet; i++) {
      for (let j = 2; j <= userCounts + 1; j++) {
        repliesUserIdArray.push(j)
      }
    }

    const tweetsIdArray = []
    for (let i = 0; i < repliesEachTweet; i++) {
      for (let i = 1; i <= userCounts * tweetsEachUser; i++) {
        tweetsIdArray.push(i)
      }
    }

    return queryInterface.bulkInsert('Replies',
      Array.from({ length: userCounts * tweetsEachUser * repliesEachTweet }, (_, i) =>
        ({
          UserId: repliesUserIdArray.shift(),
          TweetId: tweetsIdArray.shift(),
          comment: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Tweets', null, {});
    return queryInterface.bulkDelete('Replies', null, {});
  }
};

