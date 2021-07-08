let users = require("./api/users");
let tweets = require("./api/tweet");
let followships = require("./api/followships");


module.exports = (app) => {
  app.use("/api/users", users)
  app.use("/api/tweets", tweets)
  app.use("/api/followships", followships)
}