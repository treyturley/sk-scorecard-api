const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { Server } = require('socket.io')

const scorecards = require('./scorecards');

// point to env vars
dotenv.config({ path: './config/config.env' });

//define server
const app = express();

// config port
const PORT = process.env.PORT || 5000;

let io = null;

// TODO: make the cors origin a variables that gets set per ENV instead of this weird if else thing
// start server
if (process.env.NODE_ENV === 'dev') {
  io = new Server(app.listen(PORT, console.log(`Server started in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)), {
    cors: {
      origin: ["http://localhost:3000", "http://192.168.1.25:3000", "http://localhost:3001"] //this must match the source of the request,can be checked in browsers console with location cmd
    }
  });
} else {
  io = new Server(app.listen(PORT, console.log(`Server started in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)), {
    cors: {
      // TODO: see if this works or we need to include api path
      origin: "https://treyturley.com" //this must match the source of the request
    }
  });
}

// add body parser middleware to handle post bodies
app.use(express.json());

// TODO: Determine if we need this or if just json middleware is enough
app.use(express.urlencoded({ extended: false }));

// if env is dev, do some logging
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

// disable all but error logs in prod
if (process.env.NODE_ENV === 'production') {
  if (!window.console) window.console = {};
  var methods = ["log", "debug", "warn", "info"];
  for (var i = 0; i < methods.length; i++) {
    console[methods[i]] = function () { };
  }
}

io.on('connection', function (socket) {
  console.log(`New client connected with socket id: ${socket.id}`);

  socket.on('chat message', function (data) {
    io.emit('chat message', "Server: " + data);
  });

  // handle player request to join a game
  socket.on('join-game', (gameId, callback) => {
    socket.join(gameId);
    console.log(`${socket.id} is joining game ${gameId}`);
    callback('success');
  });

  // handle player request for scorecard
  socket.on('get-game', (gameid, callback) => {
    callback(scorecards.filter(scorecard => scorecard.id === gameid)[0]);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} disconnected. Reason: ${reason}`);
    console.log(`Current sockets still connected - ${io.of("/").sockets.size}`);
  });
});

// Middleware function to make io accessible
app.use(function (req, res, next) {
  req.io = io;
  next();
});

// hook route into middleware here
app.use('/api/sk-scorecard-api', require('./routes/scorecards'));