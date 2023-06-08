if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const helpers = require("./_helpers");
const routes = require("./routes");
const methodOverride = require("method-override");
const db = require("./models");
const passport = require("passport");
const app = express();
const port = process.env.PORT || 3000;

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(methodOverride("_method"));
app.use(routes);
app.get("", (req, res) => {
  res.send("Hello world!");
});
app.get("/favicon.ico", (req, res) => {
  res.sendStatus(204);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
