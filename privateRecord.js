const { EventEmitter } = require("events");
const db = require('./models')
const { User, Chatship } = db


let instance;
let MAX = 50;

class Records extends EventEmitter {
  constructor() {
    super();
  }

  push(msg, id, chatwithId, avatar, name) { //可加入資料庫中最多有多少筆紀錄
    Chatship.create({
      message: msg,
      UserId: id,
      chatwithId: chatwithId,
    }).then((chat) => {
      this.emit("new_message", msg, avatar, name)
    })
  }

  // setMax(max) {
  //   MAX = max;
  // }

  // getMax() {
  //   return MAX;
  // }
}

module.exports = (function () {
  if (!instance) {
    instance = new Records();
  }

  return instance;
})();
