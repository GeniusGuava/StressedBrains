require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/main');
const secureRoutes = require('./routes/secure');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/', secureRoutes);

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
