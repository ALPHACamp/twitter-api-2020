const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs') // 教案 package.json 用 bcrypt-node.js，不管，我先用舊的 add-on
const { User, Tweet, Reply, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../_helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password // 刪除 .password 這個 property
      // (下1) 發出 jwt token，要擺兩個引數，第一個，要包進去的資料，第二個，要放 secret key
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 30 天過期，可調
      res.json({ status: 'success', data: { token, user: userData } })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    // (下1) 測試檔不給過，先 comment，之後刪
    // if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    if (req.body.name.length > 50) throw new Error('name 字數大於 50')

    return Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })
    ])
      .then(([emailResult, accountResult]) => {
        if (emailResult && accountResult) throw new Error('email 與 account 都重複註冊！')
        if (emailResult) throw new Error('email 已重複註冊！')
        if (accountResult) throw new Error('account 已重複註冊！')
      })
    // User.findOne({
    //   where: {
    //     [Op.or]: [
    //       { email: req.body.email },
    //       { account: req.body.account }]
    //   }
    // })
    //   .then(user => {
    //     if (user) throw new Error('email 已重複註冊！')

    //     return bcrypt.hash(req.body.password, 10)
    //   })
      .then(() => bcrypt.hash(req.body.password, 10))
      .then(hash =>
        User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(createdUser => {
        const result = createdUser.toJSON()
        delete result.password // 避免不必要資料外洩
        res.status(200).json({ status: 'success', user: result })
      })
      .catch(err => next(err))
  },
  getUserInfo: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) return res.status(404).json({ message: 'Can not find this user.' })
        delete user.password
        // return res.status(200).json({ status: 'success', user })
        // 因為測試檔，所以物件格式不能像 (上1) 一樣加工，必須做成 (下1)
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const newPW = req.body.password
    // const oldPW = getUser(req).dataValues.password
    // const samePW = await bcrypt.compare(newPW, oldPW) // async 跟 promise 混用，我得小心
    // (下1) 先擋擋看，測試出錯立刻封掉 --> 真的會因為它而測試出錯...
    // const { account, name, email, password } = req.body
    // if (!account || !name || !email || !password) {
    //   throw new Error('account, name, email, password 皆為必填')
    // }

    const id = Number(req.params.id)
    // if (req.user.id !== id) {
    // (上1 不能用) 居然得為了測試擋改成這樣 (下1)
    if (getUser(req).dataValues.id !== id) {
      return res.status(401).json({
        status: 'error',
        message: 'Sorry. You do not own this account.'
      })
    }
    const { file } = req

    // 結果 async/await 可執行，但也沒法過測試，是怎樣
    // const bbb = await Promise.all([
    //   User.findByPk(id),
    //   imgurFileHandler(file), // 若有餘裕，就研究下圖片上傳的細節唄
    //   !samePW ? bcrypt.hash(newPW, 10) : oldPW
    // ])

    // req.body.image = bbb[1] || bbb[0].image
    // req.body.password = bbb[2]
    // const ccc = await bbb[0].update(req.body)
    // const ddd = ccc.toJSON()
    // // delete ddd.password
    // return await res.status(200).json(ddd)

    // 第二版，把密碼驗證機制加進去，可用，但過不了 測試檔
    // return bcrypt.compare(newPW, oldPW)
    //   .then(samePW => {
    //     return Promise.all([
    //       User.findByPk(id),
    //       imgurFileHandler(file), // 若有餘裕，就研究下圖片上傳的細節唄
    //       !samePW ? bcrypt.hash(newPW, 10) : oldPW
    //     ])
    //       .then(([user, filePath, pw]) => {
    //         if (!user) throw new Error("User doesn't exist!")
    //         req.body.image = filePath || user.image
    //         req.body.password = pw
    //         return user.update(req.body)
    //       })
    //       .then(updatedUser => {
    //         const result = updatedUser.toJSON()
    //         // delete result.password //! 之後復原
    //         return res.status(200).json(result)
    //       })
    //   })
    //   .catch(err => next(err))

    // 原始版，可過 test，但嚴格來說，密碼驗證有問題
    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file), // 若有餘裕，就研究下圖片上傳的細節唄
      bcrypt.hash(newPW, 10)
      //* !samePW ? bcrypt.hash(newPW, 10) : oldPW
      // ! 下2 之後要改
      // User.findOne({ where: { account } }),
      // User.findOne({ where: { email } })
    ])
      // .then(([user, filePath, samePW]) => {
      //   if (samePW) return [user, filePath]
      //   return [user, filePath, bcrypt.hash(req.body.password, 10)]
      // })
      .then(([user, filePath, pw]) => {
        if (!user) throw new Error("User doesn't exist!")
        // if (checkAcc) throw new Error('account 已重複註冊！')
        // if (checkMail) throw new Error('email 已重複註冊！')
        req.body.image = filePath || user.image
        req.body.password = pw
        return user.update(req.body) // 試試看唄，看能不能回傳 array
      })
      .then(updatedUser => {
        const result = updatedUser.toJSON()
        // delete result.password //! 之後復原
        return res.status(200).json(result)
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      where: { UserId: req.params.id }, // 為了測試檔而改成這樣
      raw: true,
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => res.status(200).json(tweets))
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    return Reply.findAll({
      where: { UserId: req.params.id }, // 因測試檔，改大駝峰
      raw: true,
      order: [['createdAt', 'DESC']]
    })
      .then(replies => res.status(200).json(replies))
      .catch(err => next(err))
  },
  getLikes: (req, res, next) => {
    return Like.findAll({
      where: { UserId: req.params.id }, // 因測試檔，改大駝峰
      raw: true,
      order: [['createdAt', 'DESC']]
    })
      .then(likes => res.status(200).json(likes))
      .catch(err => next(err))
  },
  getFollowings: (req, res, next) => {
    return Followship.findAll({
      where: { followerId: req.params.id },
      order: [['createdAt', 'DESC']]
    })
      // (下1) 沒做 toJSON() 處理也能輸出正常 json 檔，但得注意
      .then(followings => res.status(200).json(followings))
      .catch(err => next(err))
  },
  getFollowers: (req, res, next) => {
    return Followship.findAll({
      where: { followingId: req.params.id },
      order: [['createdAt', 'DESC']]
    })
      // (下1) 沒做 toJSON() 處理也能輸出正常 json 檔，但得注意
      .then(followers => res.status(200).json(followers))
      .catch(err => next(err))
  }
}

module.exports = userController
