// const Sequelize = require('sequelize')
const { getLastUpdated, getLastUpd } = require('../_helpers')
const { User, Tweet, Like, Reply, Followship } = require('../models')
const tweetController = {
  getTweets: async (req, res, next) => {
    // query設計
    // const userId = req.params.id
    // const { self, liked } = req.query
    // if (self) {
    // 1找到該使用者所有推文
    // 2找到該使用者追蹤的用戶的推文(依照時間序)
    // 3找到該使用者like過的文章
    try {
      const follows = req.query.follows
      const liked = req.query.liked
      const userId = req.params.id
      let tweets
      if (follows) {
        const followingIdData = await Followship.findAll({
          where: [{ follower_Id: userId }],
          attributes: ['followingId']
        })
        const followingIds = followingIdData.map(row => row.followingId)
        tweets = await Tweet.findAll({
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['account', 'name', 'avatar']
            },
            { model: Like, attributes: ['UserId'] },
            { model: Reply, attributes: ['UserId'] }
          ],
          where: [{ User_Id: followingIds }],
          order: [
            ['createdAt', 'DESC'],
            ['id', 'DESC']
          ],
          nest: true
        })
      } else if (liked) {
        // 先從like找到喜歡的編號
        // 再從編號找該貼文
        const likes = await Like.findAll({
          where: [{ User_Id: userId }],
          attributes: ['TweetId'],
          raw: true,
          nest: true
        })
        const tweetIds = likes.map(row => row.TweetId)
        tweets = await Tweet.findAll({
          where: [{ id: tweetIds }],
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['account', 'name', 'avatar']
            },
            { model: Like, attributes: ['UserId'] },
            { model: Reply, attributes: ['UserId'] }
          ],
          order: [
            ['createdAt', 'DESC'],
            ['id', 'DESC']
          ],
          nest: true
        })
      } else {
        tweets = await Tweet.findAll({
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
      }
      if (tweets.length === 0) return res.status(404).json('Tweets not found')
      const counts = tweets.map((tweet) => ({
        ...tweet.toJSON(),
        likesCount: tweet.Likes.length,
        repliesCount: tweet.Replies.length,
        lastUpdated: getLastUpd(tweet),
        account: tweet.User.account,
        name: tweet.User.name,
        avatar: tweet.User.avatar
      }))
      const data = counts.map(({ Likes, Replies, User, ...rest }) => rest)
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getTweet: (req, res, next) => {
    const id = req.params.id
    Tweet.findByPk(id, {
      include: [
        { model: User, attributes: ['account', 'name', 'avatar'] },
        { model: Like, attributes: ['UserId'] },
        { model: Reply, attributes: ['UserId'] }
      ],
      nest: true
    })
      .then((data) => {
        if (!data) return res.status(404).json('Tweets not found')
        const tweet = data.dataValues
        tweet.likesCount = tweet.Likes.length
        tweet.repliesCount = tweet.Replies.length
        tweet.account = tweet.User.account
        tweet.name = tweet.User.name
        tweet.avatar = tweet.User.avatar
        delete tweet.User
        delete tweet.Likes
        delete tweet.Replies
        getLastUpdated(tweet)
        return res.status(200).json(data)
      })
      .catch((err) => next(err))
  },
  getRepliedTweets: (req, res, next) => {
    const userId = req.params.id
    Reply.findAll({
      where: { UserId: userId },
      include: [
        { model: User, attributes: ['avatar', 'name', 'account'] },
        {
          model: Tweet,
          attributes: ['UserId'],
          include: [{ model: User, attributes: ['name'] }]
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC']
      ],
      nest: true
    })
      .then((tweets) => {
        const beforeData = tweets.map((tweet) => ({
          ...tweet.toJSON(),
          tweetUser: tweet.Tweet.User.name,
          lastUpdated: getLastUpd(tweet),
          account: tweet.User.account,
          name: tweet.User.name,
          avatar: tweet.User.avatar
        }))
        const data = beforeData.map(({ Tweet, User, ...rest }) => rest)
        res.status(200).json(data)
      })
      .catch((err) => next(err))
  },
  postTweet: (req, res, next) => {
    const { description, likable, commendable } = req.body
    if (!description) return res.status(400).json('Description can not be empty!')
    if (description.length > 140) return res.status(400).json('Max length 140.')
    const id = req.user.id
    Tweet.create({
      UserId: id,
      description,
      likable: likable || '1',
      commendable: commendable || '1'
    })
      .then((data) => {
        if (!data) return res.status(404).json('Tweet not found')
        getLastUpdated(data)
        return res.status(200).json('post success')
      })
      .catch((err) => next(err))
  },
  putTweet: (req, res, next) => {
    const { description, likable, commendable } = req.body
    const id = req.params.id
    if (!description) return res.status(400).json('Description can not be empty!')
    if (description.length > 140) return res.status(400).json('Max length 140.')
    Tweet.findByPk(id)
      .then((tweet) => {
        if (!tweet) return res.status(404).json('Tweet not found!')
        return tweet.update({
          description,
          likable: likable || '1',
          commendable: commendable || '1'
        })
      })
      .then((data) => {
        if (!data) return res.status(400).json('Update failed!')
        getLastUpdated(data)
        return res.status(200).json('update success')
      })
      .catch((err) => next(err))
  },
  deleteTweet: (req, res, next) => {
    const id = req.params.id
    Tweet.findByPk(id)
      .then((tweet) => {
        if (!tweet) return res.status(404).json('Tweet not found')
        tweet.destroy()
      })
      .then(() => {
        return res.status(200).json('Delete success')
      })
      .catch((err) => next(err))
  }
}

module.exports = tweetController
