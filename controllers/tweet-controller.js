const { tryCatch } = require('../helpers/tryCatch')
const { Like, Tweet } = require('../models')
const { getUser } = require('../_helpers')
const { ReqError } = require('../helpers/errorInstance')
const tweetController = {
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
