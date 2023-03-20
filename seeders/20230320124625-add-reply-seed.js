"use strict";
const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // - 每個一般使用者有 1 則 reply
    // - 每篇 tweet 有 3 則 replies
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE account <> 'root'",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const tweets = await queryInterface.sequelize.query(
      "SELECT id FROM Tweets",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );
    const userCount = {};
    const tweetCount = {};
    const replies = genReplies(users, tweets);
    await queryInterface.bulkInsert("Replies", replies, {});

    function genReplies(users, tweets) {
      const result = [];
      let count = 0;
      while (count < tweets.length * 3) {
        const userIndex = genRandomUserIndex(users.length);
        const tweetIndex = genRandomTweetIndex(tweets.length);
        const reply = {
          comment: faker.lorem.lines(),
          UserId: users[userIndex].id,
          TweetId: tweets[tweetIndex].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        result.push(reply);
        count += 1;
      }
      return result;
    }

    function genRandomUserIndex(length) {
      const randomIndex = Math.floor(Math.random() * length);
      if (!checkUserCount(users[randomIndex].id)) {
        return genRandomUserIndex(length);
      }
      return randomIndex;
    }

    function genRandomTweetIndex(length) {
      const randomIndex = Math.floor(Math.random() * length);
      if (!checkTweetCount(tweets[randomIndex].id)) {
        return genRandomTweetIndex(length);
      }
      return randomIndex;
    }

    function checkUserCount(UserId) {
      if (!userCount[UserId]) {
        userCount[UserId] = 1;
        return true;
      }
      if (Object.keys(userCount).length < 5) return false;
      userCount[UserId] += 1;
      return true;
    }

    function checkTweetCount(TweetId) {
      if (!tweetCount[TweetId]) {
        tweetCount[TweetId] = 1;
        return true;
      }
      if (tweetCount[TweetId] === 3) return false;
      tweetCount[TweetId] += 1;
      return true;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Replies", null, {});
  },
};
