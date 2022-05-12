const { Tweet, User, Like, Reply } = require('../models')
const { dummyUser } = require('../dummyUser.js')



const tweetController = {

  getTweets: (req, res, next) => {

    // 為節省重新重資料庫拉資料的時間，getTweets直接用資料的likeCount和replyCount做數字顯示。但為確保數字正確。會在讀取單筆tweet資料的controller中，重拉資料並計數
    Tweet.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      raw: true,
      nest: true
    })
      .then(tweets => {
        //尚未與登入功能結合，尚無法取得req.user資料，以dummyUser假資料暫代
        const likedTweetId = dummyUser.LikedTweets ? dummyUser.LikedTweets.map(t => t.id) : []
        const data = tweets.map(tweet => ({
          ...tweet,
          isLiked: likedTweetId.some(item => item === tweet.id)
        }))

        // res.status(200).json({ status: 'success', data }) 這樣寫測試過不了
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },

  getTweet: (req, res, next) => {
    Tweet.findByPk(req.params.tweet_id, {
      include: [
        Reply,
        { model: User, as: 'LikedUsers' }
      ],
      order: [
        ['createdAt', 'DESC']
      ]
    })
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在！')

        return tweet.update({
          replyCount: tweet.Replies.length,
          likeCount: tweet.LikedUsers.length,
        })
      })
      .then(tweet => {
        //尚未與登入功能結合，尚無法取得req.user資料，以dummyUser假資料暫代
        const likedTweetId = dummyUser.LikedTweets ? dummyUser.LikedTweets.map(t => t.id) : []
        const data = tweet.toJSON()
        data.isLiked = likedTweetId.some(item => item === tweet.id)
        return res.status(200).json(data)
      })
      .catch(err => next(err))
  },

  // 此部分功能正常，但為尚未無法取得req.user資料，所以無法通過測試。之後會再修正！
  postTweet: (req, res, next) => {
    const userId = 3 // 此為假資料，尚未傳接singIn funtcion
    const { description } = req.body
    if (!description) throw new Error('推文內容不可空白！')
    if (description.trim().length > 140) throw new Error('推文字數不可超過140字！')

    return Tweet.create({
      userId,
      description: req.body.description
    })
      .then(tweet => res.status(200).json(tweet))
  }

}

module.exports = tweetController