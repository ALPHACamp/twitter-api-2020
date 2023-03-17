const { User } = require("../models");

const userController = {
  signUp: async (req, res, next) => {
    const { name, account, email, password } = req.body;
    try {
      // if (!name || !account || !email || !password) {
      //   const error = new Error('欄位不可空白!')
      //   error.status = 400
      //   throw error
      // }
      const newUser = await User.create({
        name,
        account,
        email,
        password,
      });
      return res.json({
        status: "success",
        data: newUser,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = userController;
