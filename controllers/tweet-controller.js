const { Model } = require('sequelize')
const { ReqError } = require('../helpers/errorInstance')
const { User, Tweet, Followship, Reply, Like } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { tryCatch } = require('../helpers/tryCatch')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: tryCatch(async (req, res) => {
    const userData = getUser(req) instanceof Model
      ? getUser(req).toJSON()
      : getUser(req).dataValues
    const user = await User.findByPk(userData.id)
    if (!user) throw new ReqError('無此使用者資料')
    const followings = await Followship.findAll({
      where: { followerId: userData.id },
      attributes: ['followingId'],
      raw: true
    })
    // Set可以拿掉 目前種子資料難以避免重複追蹤
    const showIds = [...new Set(followings.map(e => e.followingId))]
    showIds.push(userData.id)
    const tweets = await Tweet.findAll({
      where: { UserId: showIds },
      include: [
        { model: User, as: 'poster', attributes: ['name', 'account'] },
        { model: Reply },
        { model: Like }
      ],
      order: [['createdAt', 'DESC']], // or ['id', 'DESC'] 因為理論上id越後面越新
      nest: true
    })
    const result = tweets.map(e => {
      const temp = e.toJSON()
      temp.Replies = temp.Replies.length
      temp.Likes = temp.Likes.length
      return temp
    })
    return Promise.resolve(result).then(
      result => res.status(200).json(result)
    )
  }),
  getTweet: tryCatch(async (req, res) => {
    const TweetId = req.params.tweet_id
    const tweet = await Tweet.findByPk(TweetId, {
      include: [
        {
          model: User,
          required: false,
          attributes: ['name', 'account', 'avatar'],
          as: 'poster'
        }
      ],
      raw: true
    })
    if (!tweet) throw new ReqError('此推文不存在')
    tweet.Replies = await Reply.count({ where: { TweetId } })
    tweet.Likes = await Like.count({ where: { TweetId } })
    res.send(tweet)
  }),
  postTweet: tryCatch(async (req, res) => {
    const userData = !(getUser(req) instanceof Model)
      ? getUser(req).dataValues
      : getUser(req).toJSON()
    const { description } = req.body
    const { file } = req
    const imageURL = file ? await imgurFileHandler(file) : null
    if (!description) throw new ReqError('推文不可為空')
    const result = await Tweet.create({
      UserId: userData.id,
      description,
      image: imageURL
    })
    return Promise.resolve(result).then(result =>
      res.status(200).json(result.toJSON())
    )
  }),
  like: tryCatch(async (req, res) => {
    const UserId = getUser(req).dataValues.id
    const TweetId = req.params.id
    const [tweet, like] = await Promise.all([ // 查詢欲刪除的tweet和like是否存在於資料庫中
      Tweet.findByPk(TweetId),
      Like.findAll({ where: { UserId, TweetId } })
    ])
    if (like.length || !tweet) throw new ReqError('資料庫無此筆資料或發送重複請求!')
    const result = await Like.create({ UserId, TweetId })
    // const result = Promise.resolve(createdLike)
    res.status(200).json(result)
  }),
  unlike: tryCatch(async (req, res) => {
    const UserId = getUser(req).dataValues.id
    const TweetId = req.params.id
    const [tweet, like] = await Promise.all([ // 查詢欲刪除的tweet和like是否存在於資料庫中
      Tweet.findByPk(TweetId),
      Like.findAll({ where: { UserId, TweetId } })
    ])
    if (!like.length || !tweet) throw new ReqError('資料庫無此筆資料!')
    await Like.destroy({ where: { UserId, TweetId } })
    res.status(200).json({ message: 'user unlike success' }) // 不曉得為甚麼like.destroy會報錯not a function 所以先用where查詢的方式刪除
  })
}
module.exports = tweetController
