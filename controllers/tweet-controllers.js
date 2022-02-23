const { User, Tweet, Reply } = require("../models");

const tweetController = {
  getReplies: (req, res, next) => {
    const { tweet_id } = req.params;
    return Tweet.findByPk(tweet_id, { 
        include:[
            { model: Reply, include: User }
        ]
    })
      .then(tweet => {
          console.log(tweet)
        if (!tweet)
          return res.json({ status: "error", message: "Tweet didn't exist!" });
        return res.json({ status: "success", tweet });
      })
      .catch((err) => next(err));
  },
};

module.exports = tweetController;
