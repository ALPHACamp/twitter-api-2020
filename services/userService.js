const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
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
  },
  signIn: async (account, password) => {
    const user = await User.findOne({ where: { account } })
    if (!user) {
      return { status: "error", message: "no such user found" };
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return { status: "error", message: "passwords did not match" };
    }
    // Give token
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return {
      status: "success",
      message: "Successfully login",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }
}

module.exports = userService
