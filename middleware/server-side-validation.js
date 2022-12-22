const validator = require('validator')

const { User } = require('../models')
const helpers = require('../_helpers')
const { sanitizedInput, checkUriParam } = require('../helpers/sanitized')
async function registerValidation (req, res, next) {
  try {
    const { account, name, email, password, checkPassword } = req.body

    if (!account?.trim() || !name?.trim() || !email?.trim() || !password?.trim() || !checkPassword?.trim()) {
      return res.status(400).json({ status: 'error', message: 'All field are required!' })
    }
    if (!validator.isEmail(email)) {
      return res.status(422).json({ status: 'error', message: 'Email input is invalid!' })
    }
    if (password !== checkPassword) {
      return res.status(422).json({ status: 'error', message: 'Password and confirmPassword do not match.' })
    }
    if (name.length > 50) {
      return res.status(422).json({ status: 'error', message: 'Name field has max length of 50 characters.' })
    }

    const [userAccount, userEmail] = await Promise.all([User.findOne({ where: { account } }), User.findOne({ where: { email } })])
    if (userAccount) return res.status(422).json({ status: 'error', message: 'Account already exists!' })
    if (userEmail) return res.status(422).json({ status: 'error', message: 'Email already exists!' })

    // sanitized user input
    req.body = {
      ...req.body,
      account: sanitizedInput(account),
      name: sanitizedInput(name),
      email: sanitizedInput(email)
    }
    return next()
  } catch (err) { next(err) }
}

function userProfileValidation (req, res, next) {
  try {
    const profileId = Number(checkUriParam(sanitizedInput(req.params.id)))
    const loginUserId = helpers.getUser(req).id
    const { name, introduction } = req.body
    if (!name?.trim()) {
      return res.status(400).json({ status: 'error', message: 'User name is required!' })
    }
    if (name?.length > 50) {
      return res.status(422).json({ status: 'error', message: 'Username should be less than 50 chars.' })
    }
    if (introduction?.length > 160) {
      return res.status(422).json({ status: 'error', message: "User's introduction should be less than 160 chars" })
    }
    if (profileId !== loginUserId) {
      return res.status(403).json({ status: 'error', message: "Cannot edit other user's profile." })
    }

    req.body = {
      ...req.body,
      name: sanitizedInput(name),
      introduction: sanitizedInput(introduction)
    }

    return next()
  } catch (err) { next(err) }
}

async function userSettingValidation (req, res, next) {
  try {
    const reqId = Number(checkUriParam(sanitizedInput(req.params.id)))
    const loginUserId = helpers.getUser(req).id
    const { account, name, email, password, checkPassword } = req.body

    if (!account?.trim() || !name?.trim() || !email?.trim() || !password?.trim() || !checkPassword?.trim()) {
      return res.status(400).json({ status: 'error', message: 'All field are required!' })
    }
    if (!validator.isEmail(email)) {
      return res.status(422).json({ status: 'error', message: 'Email input is invalid!' })
    }
    if (password !== checkPassword) {
      return res.status(422).json({ status: 'error', message: 'Password and confirmPassword do not match.' })
    }
    if (name.length > 50) {
      return res.status(422).json({ status: 'error', message: 'Name field has max length of 50 characters.' })
    }
    if (reqId !== loginUserId) {
      return res.status(403).json({ status: 'error', message: "Cannot edit other user's setting." })
    }

    const user = await User.findByPk(reqId)
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found!' })

    const [otherUserEmail, otherUserAccount] = await Promise.all([User.findOne({ where: { email }, raw: true }), User.findOne({ where: { account }, raw: true })])
    // account and email cannot be the same as others
    if (email === otherUserEmail?.email && user?.id !== otherUserEmail?.id) return res.status(422).json({ status: 'error', message: 'Email already exists!' })

    if (account === otherUserAccount?.account && user?.id !== otherUserAccount?.id) return res.status(422).json({ status: 'error', message: 'Account name already exists!' })

    req.userEdit = user

    req.body = {
      ...req.body,
      account: sanitizedInput(account),
      name: sanitizedInput(name),
      email: sanitizedInput(email)
    }
    return next()
  } catch (err) { next(err) }
}

module.exports = { registerValidation, userProfileValidation, userSettingValidation }
