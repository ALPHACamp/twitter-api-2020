if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}
const express = require("express")
const helpers = require("./_helpers")
const app = express()
const port = 3000
const exphbs = require("express-handlebars")
const userController = require("./controllers/userController")
const passport = require("./config/passport")
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }))
app.set("view engine", "hbs")
app.use(express.urlencoded({ extended: true }))

const authenticated = passport.authenticate("jwt", { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    return res.json({ status: "error", message: "permission denied" })
  } else {
    return res.json({ status: "error", message: "permission denied" })
  }
}

app.post("/signup", userController.signUp)
app.post("/signin", userController.signIn)

app.get("/", (req, res) => res.send("Hello World!"))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
