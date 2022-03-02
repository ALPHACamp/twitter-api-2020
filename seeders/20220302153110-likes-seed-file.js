'use strict';

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

    const RANDOM_DEFAULT_NUMBER = 0
    const DEFAULT_LIKES_NUMBER = 5

    // retrieve all user data from database except for admin
    // also retrieve all tweet data from database
    return Promise.all([
      queryInterface.sequelize.query(
        `SELECT * FROM Users WHERE role='user'`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        `SELECT * FROM Tweets`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])
      .then(([users, tweets]) => {
        // prepare an array of all like data
        const likesArray = users.flatMap(user => {

          // pre fill tweetSet with specific TweetId
          const tweetSet = new Set()
          tweets.forEach(t => {
            if (t.UserId === user.id) tweetSet.add(t.TweetId)
          })

          return Array.from({ length: DEFAULT_LIKES_NUMBER }, () => {
            // assign random number to TweetId
            let TweetId = RANDOM_DEFAULT_NUMBER

            do {
              // generate random UserId
              TweetId = tweets[Math.floor(Math.random() * tweets.length)].id

              // check if generated TweetId had one record in the same like
            } while (tweetSet.has(TweetId))

            tweetSet.add(TweetId)

            return {
              UserId: user.id,
              TweetId,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        })

        // prepare an array of all tweet data
        // and update totalLikes and updatedAt fields
        const tweetsArray = tweets.map(tweet => {
          const {
            id, UserId, description, totalReplies, createdAt
          } = tweet

          // calculate totalLikes value
          let totalLikes = 0
          likesArray.forEach(l => {
            if (l.TweetId === tweet.id) totalLikes ++
          })

          return {
            id,
            UserId,
            description,
            totalLikes,
            totalReplies,
            createdAt,
            updatedAt: new Date()
          }
        })

        // prepare an array of all user data
        // and update total counts and updatedAt fields
        const usersArray = users.map(user => {
          const {
            id, email, name, avatar, introduction, account, password, 
            role, totalTweets, totalFollowings, totalFollowers, createdAt
          } = user

          // calculate totalLiked value
          let totalLiked = 0
          for (let x = 0; x < likesArray.length; x++) {
            for (let y = 0; y < tweetsArray.length; y++) {
              if (
                likesArray[x].TweetId === tweetsArray[y].id &&
                tweetsArray[y].UserId === user.id
              ) { totalLiked ++ }
            }
          }

          return {
            id,
            email,
            name,
            avatar,
            introduction,
            account,
            password,
            role,
            totalTweets,
            totalLiked,
            totalFollowings,
            totalFollowers,
            createdAt,
            updatedAt: new Date()
          }
        })

        // execute two database commands at the same time
        return Promise.all([
          queryInterface.bulkInsert('Likes', likesArray, {}),
          queryInterface.bulkInsert('Tweets', tweetsArray, {
            updateOnDuplicate: ['totalLikes', 'updatedAt']
          }),
          queryInterface.bulkInsert('Users', usersArray, {
            updateOnDuplicate: ['totalLiked', 'updatedAt']
          }),
        ])
      })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    return queryInterface.bulkDelete('Likes', null, {})
  }
};
