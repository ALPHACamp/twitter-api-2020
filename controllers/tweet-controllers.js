const { User, Tweet, Reply } = require("../models");

const tweetController = {
  getReplies: (req, res, next) => {
    const { tweet_id } = req.params;
    return Tweet.findByPk(tweet_id, {
      include: [Reply],
    })
      .then((tweet) => {
        if (!tweet)
          return res.json({ status: "error", message: "Tweet didn't exist!" });
        return res.json(tweet.Replies);
      })
      .catch((err) => next(err));
  },
};

module.exports = tweetController;
