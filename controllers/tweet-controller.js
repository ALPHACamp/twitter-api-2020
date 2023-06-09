const tweetServices = require('../services/tweet-services')
const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')
const { Tweet } = require('../models')
const { getUser } = require('../_helpers')
const tweetController = {
  getTweets: async(req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTweet: async(req, res, next) => {
    tweetServices.getTweet(req, (err, data) => err ? next(err) : res.json(data))
  },
  postTweets: async (req, res, next) => {
    try {
      const { description } = req.body;
      const UserId = req.user.id;

      if (!description) {
        throw new Error('Tweet不能為空!');
      }

      if (description.length > 140) {
        throw new Error('輸入不得超過140字!');
      }

      const tweet = await Tweet.create({
        description,
        UserId,
      })
      res.status(200).json(tweet);
    } catch (err) {
          next(err)
    }
  },
}
module.exports = tweetController