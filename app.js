const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config')

const stadiumsRoutes = require('./routes/stadiums-routes');
const palcosRoutes = require('./routes/palcos-routes');
const usersRoutes = require('./routes/users-routes');
const eventsRoutes = require('./routes/events-routes');
const teamsRoutes = require('./routes/teams-routes');
const competitionRoutes = require('./routes/competitions-routes');
const reservationRoutes = require('./routes/user-routes');
const userRoutes = require('./routes/reservations-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(express.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/user', userRoutes);
app.use('/stadiums', stadiumsRoutes);
app.use('/palcos', palcosRoutes);
app.use('/users', usersRoutes);
app.use('/events', eventsRoutes);
app.use('/teams', teamsRoutes);
app.use('/competition', competitionRoutes);
app.use('/reservation', reservationRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(process.env.DB_CONNECTION,{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
      console.log("connected");
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
