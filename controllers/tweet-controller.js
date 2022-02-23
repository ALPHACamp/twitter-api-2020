module.exports = {
  getTweets: async (req, res, next) => {
    try {
      return res.status(200).json({
        message: 123
      })

    } catch (err) { next(err) }
  }
}