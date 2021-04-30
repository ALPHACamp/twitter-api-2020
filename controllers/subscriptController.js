const db = require('../models')
const Subscript = db.Subscript
const { getUser } = require('../_helpers')
const subscriptController = {
  addSubscript: async (req, res, next) => {
    try {
      const subscriberId = getUser(req).id
      const authorId = req.body.id

      if (!subscriberId || !authorId || (subscriberId === authorId)) {
        return res.json({ status: 'error', message: "There is some error with subscriberId or authorId." })
      }
      await Subscript.create({
        subscriberId, authorId
      })
      return res.json({ status: 'success', message: 'Subscript has built successfully!' })

    } catch (e) {
      console.log(e)
      return next(e)
    }

  },

  removeSubscript: async (req, res, next) => {
    try {
      let subscript = await Subscript.findOne({
        where: {
          subscriberId: getUser(req).id,
          authorId: req.params.userId
        }
      })
      if (subscript === null) {
        return res.json({ status: 'error', message: "Can't find subscripts." })
      }
      subscript.destroy()
      return res.json({ status: 'success', message: 'Subscript has removed successfully!' })
    } catch (e) {
      console.log(e)
      return next(e)
    }
  }
}

module.exports = subscriptController