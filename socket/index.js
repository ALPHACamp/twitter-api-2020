const Messages = require('../models/mongoDB/Messages');
const moment = require('moment');

const SocketHander = {
  getMessages: async (req, res, next) => {
    try {
      return Messages.find();
    }
    catch (err) {
      next(err)
    }
  },
  storeMessages: async (data, req, res, next) => {
    try {
      console.log(data);
      const newMessages = await new Messages({
        name: data.name,
        msg: data.msg,
        time: moment().valueOf(),
      });

      await newMessages.save();
    }
    catch (err) {
      next(err)
    }
  }
}
module.exports = SocketHander