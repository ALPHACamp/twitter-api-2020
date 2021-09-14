const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;



const userService = {
  signUp : async (account, email, password) => {
    const duplicate_email = await User.findOne({ where: { email } });
    if (duplicate_email) {
      return { status: "error", message: "This email has been registered" };
    }
    const duplicate_account = await User.findOne({ where: { account } });
    if (duplicate_account) {
      return { status: "error", message: "This account name has been registered" };
    }

    const newUser = await User.create({
      account,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });
    return { status: "success", message: "Successfully sign up"};

  }
}

module.exports = userService
