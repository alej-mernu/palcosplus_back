const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
console.log("entra")
require('dotenv/config')

const stadiumsRoutes = require('./routes/stadiums-routes');
const palcosRoutes = require('./routes/palcos-routes');
const usersRoutes = require('./routes/users-routes');
const eventsRoutes = require('./routes/events-routes');
const teamsRoutes = require('./routes/teams-routes');
const competitionRoutes = require('./routes/competitions-routes');
const reservationRoutes = require('./routes/reservations-routes');
const paymentRoutes = require('./routes/payments-routes');
const tarifasRoutes = require('./routes/tarifas-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(express.json());
app.use('/public/images', express.static(path.join('public', 'images')));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/user', usersRoutes);
app.use('/stadiums', stadiumsRoutes);
app.use('/palcos', palcosRoutes);
app.use('/events', eventsRoutes);
app.use('/teams', teamsRoutes);
app.use('/competition', competitionRoutes);
app.use('/reservation', reservationRoutes);
app.use('/pay', paymentRoutes);
app.use('/tarifas', tarifasRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;
console.log(port)
mongoose
  .connect("mongodb+srv://palcosplus:Palcosplus.10@cluster0.bsm72.mongodb.net/PalcosPlusDataBase?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    app.listen(5000, function () {
      console.log("server listening port " + port);
    });
  })
  .catch(err => {
    console.log(err);
  });
