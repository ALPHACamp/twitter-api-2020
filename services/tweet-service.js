const { User, Tweet, Like, Reply } = require('../models')
const { getLikedTweetsIds } = require('../helpers/user')

const tweetServices = {
  getTweets: async (req, res, next) => {
    let tweets = await Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'account', 'avatar'] }],
      raw: true,
      nest: true
    })

    // Clean data with isLiked
    const userLikes = await getLikedTweetsIds(req)

    tweets = tweets.map(tweet => ({
      ...tweet,
      isLiked: userLikes.includes(tweet.id)
    }))

    return tweets
  },
  postTweet: async (user, description) => {
    // user need to be extract from helper in order to meet the test,
    // otherwise it will show timeout exceed 2000 ms.
    if (!description) throw new Error('Tweet description is required.')

    // Block description which is empty string
    if (description.trim() === '') throw new Error('Tweet cannot be empty.')

    // Block description which't exceed 140 words.
    if (description.length > 140)
      throw new Error('Tweet content must not exceed 140 words.')

    const tweet = await Tweet.create({
      UserId: user.id,
      description
    })

    return {
      status: 'success',
      message: 'New tweet posted.',
      tweet
    }
  },
  getTweet: async (tweetId, req) => {
    let tweet = await Tweet.findByPk(tweetId, {
      include: [
        { model: User, attributes: ['name', 'account', 'avatar'] },
        {
          model: Reply,
          include: [
            { model: User, attributes: ['name', 'account', 'avatar'] }
          ]
        }
      ]
    })

    // Clean data
    const userLikes = await getLikedTweetsIds(req)

    tweet = {
      ...tweet.dataValues,
      isLiked: userLikes.includes(tweet.id)
    }

    return tweet
  },
  likeTweet: async (tweetId, userId) => {
    const tweet = await Tweet.findByPk(tweetId)
    if (!tweet) throw new Error("This Tweet didn't exist!")

    const [isLiked, created] = await Like.findOrCreate({
      where: { TweetId: tweetId, UserId: userId }
    })

    if (!created) throw new Error("You have already like this tweet!")

    Promise.all([
      User.findByPk(userId),
      Tweet.findByPk(tweetId)
    ]).then(([user, tweet]) => {
      user.increment('likedCount')
      tweet.increment('likedCount')
    })

    return {
      isLiked,
      status: 'success',
      message: "Add Tweet's like successfully"
    }
  },

  unlikeTweet: async (tweetId, userId) => {
    const unlike = await Like.findOne({
      where: { TweetId: tweetId, UserId: userId }
    })
    if (!unlike) throw new Error("You haven't like this tweet!")

    await unlike.destroy()

    Promise.all([
      User.findByPk(userId),
      Tweet.findByPk(tweetId)
    ]).then(([user, tweet]) => {
      user.decrement('likedCount')
      tweet.decrement('likedCount')
    })

    return {
      unlike,
      status: 'success',
      message: "Remove Tweet's like successfully"
    }
  }
}

module.exports = tweetServices