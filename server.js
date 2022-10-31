const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// point to env vars
dotenv.config({ path: './config/config.env' });

//define server
const app = express();

// add body parser middleware to handle post bodies
app.use(express.json());

// TODO: Determine if we need this or if just json middleware is enough
app.use(express.urlencoded({ extended: false }));

// TODO: consider if we want to also add logging for PROD
// if env is dev, do some logging
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

// hook route into middleware here
app.use('/api/v1/scorecards', require('./routes/scorecards'));

// config port
// const PORT = process.env.PORT || 5000;
const PORT = 5000;

// start server
app.listen(PORT, console.log(`Server started in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));