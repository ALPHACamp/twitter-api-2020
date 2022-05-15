const { Reply, LikedReply } = require('../models')

// setting reply-related controller
const replyController = {
  likeReply: (req, res, next) => {
    /*
    :param id: replyId
    This api would create a like relation between user and reply, and return a json
    */
    const userId = req.user.id
    const replyId = req.params.id
    return Promise.all([
      Reply.findByPk(replyId),
      LikedReply.findOne({
        where: {
          userId,
          replyId
        }
      })
    ])
      .then(([reply, likedReply]) => {
        if (!reply) throw new Error("Reply didn't exist!")
        if (likedReply) throw new Error('You have liked this reply!')

        return LikedReply.create({
          userId,
          replyId
        })
      })
      .then(likedReply => {
        return res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            likedReply
          },
          message: ''
        })
      })
      .catch(err => next(err))
  },
  unlikeReply: (req, res, next) => {
    /*
    :param id: replyId
    This api would destroy a like relation between user and reply, and return a json
    */
    const userId = req.user.id
    const replyId = req.params.id
    return LikedReply.findOne({
      where: {
        userId,
        replyId
      }
    })
      .then(likedReply => {
        if (!likedReply) throw new Error("You haven't liked this reply!")

        return likedReply.destroy()
      })
      .then(likedReply => {
        return res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            likedReply
          },
          message: ''
        })
      })
      .catch(err => next(err))
  },
  putReply: async (req, res, next) => {
    /*
    :param id: replyId
    :body comment: reply's content
    This api would edit a reply record and return a json
    */
    const userId = req.user.id
    const replyId = req.params.id
    const comment = req.body.comment
    if (!comment) throw new Error('Comment is required!')
    try {
      const reply = await Reply.findOne({
        where: { id: replyId, userId }
      })
      if (!reply) throw new Error("Reply didn't exist or you don't have permission to edit!")
      const updatedReply = await reply.update({
        comment
      })
      res.json({
        status: 'Success',
        statusCode: 200,
        data: {
          reply: updatedReply
        },
        message: ''
      })
    } catch (err) {
      next(err)
    }
  },
  deleteReply: async (req, res, next) => {
    /*
    :param id: replyId
    This api would delete a reply record and its related likeReplies record, and return a json
    */
    const userId = req.user.id
    const replyId = req.params.id
    try {
      const reply = await Reply.findOne({
        where: { id: replyId, userId }
      })
      if (!reply) throw new Error("Reply didn't exist or you don't have permission to edit!")
      const destroyedReply = await reply.destroy()
      await LikedReply.destroy({
        where: { replyId }
      })
      res.json({
        status: 'Success',
        statusCode: 200,
        data: {
          reply: destroyedReply
        },
        message: ''
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
