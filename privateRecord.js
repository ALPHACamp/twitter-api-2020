const { EventEmitter } = require("events");
const db = require('./models')
const { User, Chatship } = db


let instance;
let MAX = 50;

class Records extends EventEmitter {
  constructor() {
    super();
  }

  push(msg, id, avatar, name) { //可加入資料庫中最多有多少筆紀錄
    Chatship.create({
      message: msg,
      UserId: id,
      // chatwithId: 2,
    }).then((chat) => {
      this.emit("new_message", msg, id, avatar, name)
    })
  }


  get(callback) {
    Chatship.findAll({
      where: { [Op.or]: [{ chaterId: 1 }, { chatwithId: 1 }] },
      raw: true, nest: true,
      order: [['createdAt', 'ASC']],
      include: [User]
    }).then((msgs) => {
      return callback(msgs)
    })
  }

  setMax(max) {
    MAX = max;
  }

  getMax() {
    return MAX;
  }
}

module.exports = (function () {
  if (!instance) {
    instance = new Records();
  }

  return instance;
})();
