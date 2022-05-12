const { Tweet } = require('../models')

const tweetController = {

  getTweets: (req, res, next) => {

    // 為節省重新重資料庫拉資料的時間，這裏直接用資料的likeCount和replyCount做數字顯示。但為確保數字正確。會在讀取單筆tweet資料的controller中，重拉資料並計數

    // 取得所有tweets資料，並依上傳時間序排列
    // 關聯登入使用者的likedTweet，判斷喜歡狀態，供前端渲染畫面

    return Tweet.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      raw: true
    })
      .then(tweets => res.json({ status: 'success', tweets }))
      .catch(err => next(err))

  }
}

module.exports = tweetController