const validator = require('validator')

module.exports = {
  randomDate: (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  },
  formValidation: (account, name, email, password, checkPassword) => {
    const message = []
    // check all inputs are required
    if (!account || !name || !email || !password || !checkPassword) {
      message.push('All fields are required！')
    }
    // check name length and type
    if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
      message.push('Name can not be longer than 50 characters.')
    }
    // check account length and type
    if (account && !validator.isByteLength(account, { min: 0, max: 20 })) {
      message.push('Account can not be longer than 20 characters.')
    }
    // check email validation
    if (email && !validator.isEmail(email)) {
      message.push(`${email} is not a valid email address.`)
    }
    // check password length and type
    if (password && !validator.isByteLength(password, { min: 5, max: 15 })) {
      message.push('Password does not meet the required length.')
    }
    // check password and checkPassword
    if (password && (password !== checkPassword)) {
      message.push('The password and confirmation do not match.Please retype them.')
    }
    return (message)
  }
}
