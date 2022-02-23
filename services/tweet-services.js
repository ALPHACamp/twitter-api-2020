const { User, Tweet, Reply } = require('../models')

const tweetController = {
    getTweets: async (req, cb) => {
        try{
            const tweets = await Tweet.findAll({
                include: User,
                raw: true,
                nest: true
            })
            return cb(null, tweets)
        }catch(err){
            return cb(err)
        }
    }

}
module.exports = tweetController