if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const express = require('express');
const methodOverride = require('method-override');

const cors = require('cors');
const passport = require('./config/passport');
const routes = require('./routes');
const helpers = require('./_helpers');

const app = express();
const port = process.env.PORT || 3000;

// 限定網域設定
// const corsOptions = {
//   origin: 'https://pure-scrubland-51482.herokuapp.com/',
// };

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());

app.use(methodOverride('_method'));

app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.use('/api', routes);

app.get('/', (req, res) => res.send(`You did not pass the authentication`));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
