const { Tweet } = require('../models')

const tweetController = {
postTweets:(req,res,next )=> {
  
}
}

module.exports = tweetController




// POST	/api/tweets/:id/like	喜歡某則tweet
// POST	/api/tweets/:id/unlike	取消喜歡某則tweet
// POST	/api/tweets/:id/replies	新增回覆
// GET	/api/tweets/:id/replies	讀取回覆
// POST	/api/tweets	新增tweets
// GET	/api/tweets	查看tweets
// GET	/api/tweets/:id	查看特定tweet