const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
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
const rentsRoutes = require('./routes/rents-routes');
const emailsRoutes = require('./routes/emails-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/public/images', express.static(path.join('public', 'images')));

app.get('/health', function (req,res,next){
  return
})

app.use('/user', usersRoutes);
app.use('/stadiums', stadiumsRoutes);
app.use('/palcos', palcosRoutes);
app.use('/events', eventsRoutes);
app.use('/teams', teamsRoutes);
app.use('/competition', competitionRoutes);
app.use('/reservation', reservationRoutes);
app.use('/pay', paymentRoutes);
app.use('/tarifas', tarifasRoutes);
app.use('/rents', rentsRoutes);
app.use('/sendEmail', emailsRoutes);

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

const port = (process.env.port || 5000);
mongoose
  .connect("mongodb+srv://alej_mernu:Janomn_4@cluster0.v7njn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    app.listen(port, function () {
      console.log("server listening port " + port);
    });
  })
  .catch(err => {
    console.log(err);
  });
