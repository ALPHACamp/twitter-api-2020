const bcrypt = require('bcryptjs')

const userController = {
  signUp: (req, res) => {
    const { account, name, email, password, passwordConfirm } = req.body
    const errors = []
    if (!account && !name && !email && !password && !passwordConfirm) {
      errors.push({ status: 'error', message: 'all columns are empty' })
    } else if (!account) {
      errors.push({ status: 'error', message: 'account is empty' })
    } else if (!name) {
      errors.push({ status: 'error', message: 'name is empty' })
    } else if (!email) {
      errors.push({ status: 'error', message: 'email is empty' })
    } else if (!password) {
      errors.push({ status: 'error', message: 'password is empty' })
    } else if (!passwordConfirm) {
      errors.push({ status: 'error', message: 'passwordConfirm is empty' })
    } else if (password !== passwordConfirm) {
      errors.push({ status: 'error', message: 'password or passwordConfirm is incorrect' })
    }
    if (errors.length) return res.json(...errors);


    User.findOne({ where: { account } })
      .then(userOwnedAccount => {
        if (userOwnedAccount) {
          return res.json({ status: 'error', message: 'this account is registered' })
        }
        User.findOne({ where: { email } })
          .then(userOwnedEmail => {
            if (userOwnedEmail) {
              return res.json({ status: 'error', message: 'this email is registered' })
            }
            return User.create({
              account,
              name,
              email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
              role: 'user'
            })
          })
          .then(() => res.json({ status: 'success', message: 'register successfully' }))
          .catch(err => console.log(err))
      }).catch(err => console.log(err))
  }
}

module.exports = userController