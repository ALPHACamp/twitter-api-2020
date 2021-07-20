const RequestError = require("./customError")

module.exports = {
  signUpValidation (formData) {
    const { account, name, email, password, checkPassword } = formData

    if (!account || !name || !email || !password) {
      throw new RequestError('All field are required.')
    }

    if (!account.trim() || !name.trim() || !email.trim() || !password.trim()) {
      throw new RequestError('All field are required.')
    }

    if (!email.match(/.+@.+\..+/i)) {
      throw new RequestError('Invalid email.')
    }

    if (password !== checkPassword) {
      throw new RequestError('Fields password and checkPassword must be the same.')
    }
  }
}