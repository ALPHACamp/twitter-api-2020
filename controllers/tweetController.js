// const Sequelize = require('sequelize')
const { getLastUpdated, getLastUpd } = require('../_helpers')
const { User, Tweet, Like, Reply } = require('../models')
const tweetController = {
  getTweets: (req, res, next) => {
    const userId = req.params.id
    Tweet.findAll({
      where: { UserId: userId },
      include: [
        { model: User, attributes: ['account', 'name', 'avatar'] },
        { model: Like, attributes: ['UserId'] },
        { model: Reply, attributes: ['UserId'] }
      ],
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC']
      ],
      nest: true
    })
      .then(tweets => {
        if (tweets.length === 0) throw new Error('Tweets not found')
        const counts = tweets
          .map(tweet => ({
            ...tweet.toJSON(),
            likesCount: tweet.Likes.length,
            repliesCount: tweet.Replies.length,
            lastUpdated: getLastUpd(tweet)
          }))
        const data = counts.map(({ Likes, Replies, ...rest }) => rest)
        return res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const id = req.params.id
    Tweet.findByPk(
      id, {
        include: [
          { model: User, attributes: ['account', 'name', 'avatar'] },
          { model: Like, attributes: ['UserId'] },
          { model: Reply, attributes: ['UserId'] }
        ],
        nest: true
      }

    )
      .then(data => {
        if (!data) throw new Error('Tweet not found')
        const tweet = data.dataValues
        tweet.likesCount = tweet.Likes.length
        tweet.repliesCount = tweet.Replies.length
        delete tweet.Likes
        delete tweet.Replies
        getLastUpdated(tweet)
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  getRepliedTweets: (req, res, next) => {
    const userId = req.params.id
    Reply.findAll({
      where: { UserId: userId },
      include: [
        { model: User, attributes: ['avatar', 'name', 'account'] },
        { model: Tweet, attributes: ['UserId'], include: [{ model: User, attributes: ['name'] }] }
      ],
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC']
      ],
      nest: true
    })
      .then(tweets => {
        const beforeData = tweets
          .map(tweet => ({
            ...tweet.toJSON(),
            tweetUser: tweet.Tweet.User.name,
            lastUpdated: getLastUpd(tweet)
          }))
        const data = beforeData.map(({ Tweet, ...rest }) => rest)
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const { description, likable, commendable } = req.body
    if (!description) throw new Error('Description can not be empty!')
    if (description.length > 140) throw new Error('Max length 140.')
    const id = req.user.id
    Tweet.create({
      UserId: id,
      description,
      likable: likable || '1',
      commendable: commendable || '1'
    })
      .then(data => {
        if (!data) throw new Error('Tweet not found!')
        getLastUpdated(data)
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  putTweet: (req, res, next) => {
    const { description, likable, commendable } = req.body
    const id = req.params.id
    if (!description) throw new Error('Description can not be empty!')
    if (description.length > 140) throw new Error('Max length 140.')
    Tweet.findByPk(id)
      .then(tweet => {
        if (!tweet) throw new Error('Tweet not found!')
        return tweet.update({
          description,
          likable: likable || '1',
          commendable: commendable || '1'
        })
      })
      .then(data => {
        if (!data) throw new Error('Update failed!')
        getLastUpdated(data)
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    const id = req.params.id
    Tweet.findByPk(id)
      .then(tweet => {
        if (!tweet) throw new Error('Tweet not found')
        tweet.destroy()
      })
      .then(() => {
        res.json({ status: 'success', message: 'Delete success' })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController

// const { Tweet, User, Like } = require('../models'); // 假设你的模型文件中包含了 Tweet, User 和 Like 模型的定义

// getTweet: (req, res, next) => {
//   const id = req.params.id;

//   Tweet.findByPk(id, {
//     include: [
//       {
//         model: User,
//         attributes: ['account', 'name', 'avatar']
//       },
//       {
//         model: Like,
//         attributes: [[Sequelize.fn('COUNT', Sequelize.col('TweetId')), 'likeCount']]
//       }
//     ]
//   })
//     .then(data => {
//       if (!data) throw new Error('Can not find this tweet!');

//       const tweetData = data.toJSON();
//       tweetData.likeCount = data.Likes[0].get('likeCount'); // 获取聚合函数计算的 like 总数

//       res.json({ status: 'success', data: tweetData });
//     })
//     .catch(err => next(err));
// }
