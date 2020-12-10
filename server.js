require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const routes = require('./routes/main');
const secureRoutes = require('./routes/secure');

const uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on('connected', function () {
  console.log('connected to mongo');
});

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

require('./auth/auth');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/', passport.authenticate('jwt', { session: false }), secureRoutes);

app.use((req, res, next) => {
  res.status(404);
  res.json({ message: '404 - Not Found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.set('port', process.env.PORT || 8080);

const server = app.listen(app.get('port'), function () {
  console.log('listening on port ', server.address().port);
});
