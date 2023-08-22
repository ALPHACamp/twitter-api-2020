'use strict'

const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { Op } = require('sequelize')

const userController = {
  signUp: async (req, res, next) => {
    try {
      // 反查 account 與 email 是否有被註冊過
      const user = await User.findOne({
        where: {
          [Op.or]: [{ account: req.body.account }, { email: req.body.email }]
        },
        raw: true,
        nest: true
      })

      // 驗證 account 不能重複
      if (user?.account === req.body.account) {
        return res.status(400).json({
          status: 'error',
          message: [{
            path: 'account',
            msg: 'account 已重複註冊！'
          }]
        })
      }

      // 驗證 email 不能重複
      if (user?.email === req.body.email) {
        return res.status(400).json({
          status: 'error',
          message: [
            {
              path: 'email',
              msg: 'email 已重複註冊！'
            }]
        })
      }

      // 建立使用者資料
      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash,
        role: 'user',
        avatar: 'https://i.imgur.com/q6bwDGO.png',
        cover: 'https://i.imgur.com/1jDf2Me.png'
      })

      // 回傳訊息
      return res.status(200).json({
        status: 'success',
        message: '註冊成功'
      })
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = userController
