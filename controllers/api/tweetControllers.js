const helpers = require('../../_helpers')
const db = require('../../models')
const Tweet = db.Tweet

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [{}]
    }).then(data => {

    })
  }

}

module.exprots = tweetController