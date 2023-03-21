if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const passport = require('./config/passport');
const routes = require('./routes');
const helpers = require('./_helpers');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use('/api', routes);

app.get('/', (req, res) => res.send(`You did not pass the authentication`));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
