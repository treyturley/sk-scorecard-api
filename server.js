const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorMiddleware');
const connectDB = require('./services/dbService');
const { getGameByGameId } = require('./services/scorecardService');
const { Server } = require('socket.io');

// point to env vars
dotenv.config({ path: './config/config.env' });

// connect to db
connectDB();
const app = express();

// config port
const PORT = process.env.PORT || 5000;

let origin = process.env.CORS_ORIGIN;

const io = new Server(
  app.listen(
    PORT,
    console.log(
      `Server started in ${
        process.env.NODE_ENV
      } mode on port ${PORT} on ${Date()}`.yellow.bold
    )
  ),
  {
    cors: {
      origin: origin,
    },
    path: '/api/sk-scorecard-api/socket.io/',
  }
);

// add body parser middleware to handle post bodies
app.use(express.json());

// TODO: Determine if we need this or if just json middleware is enough
app.use(express.urlencoded({ extended: false }));

// if env is dev, do some logging
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

//disable all but error logs in prod
if (process.env.NODE_ENV === 'production') {
  var methods = ['log', 'debug', 'warn', 'info'];
  for (var i = 0; i < methods.length; i++) {
    console[methods[i]] = function () {};
  }
}

io.on('connection', function (socket) {
  console.log(`New client connected with socket id: ${socket.id}`);

  socket.on('chat message', function (data) {
    io.emit('chat message', 'Server: ' + data);
  });

  // handle player request to join a game
  socket.on('join-game', (gameId, callback) => {
    socket.join(gameId);
    socket.gameId = gameId;
    console.log(`${socket.id} is joining game ${gameId}`);
    callback('success');
  });

  // handle player request for scorecard
  socket.on('get-game', async (gameId, callback) => {
    console.log(
      `Handling get-game event. Responding with game details for game: ${socket.gameId}`
    );
    const scorecard = await getGameByGameId(socket.gameId);
    callback(scorecard);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket ${socket.id} disconnected. Reason: ${reason}`);
    console.log(
      `Current sockets still connected to this server - ${
        io.of('/').sockets.size
      }`
    );
    if (io.sockets.adapter.rooms.get(socket.gameId)) {
      console.log(
        `Current sockets on game ${socket.gameId} - ${
          io.sockets.adapter.rooms.get(socket.gameId).size
        }`
      );
    } else {
      console.log(
        `No sockets connected to game ${socket.gameId}. Game room is closed.`
      );
    }
  });
});

// Middleware function to make io accessible
app.use(function (req, res, next) {
  req.io = io;
  next();
});

// middleware for the async error handler
app.use(errorHandler);

// hook route into middleware here
app.use('/api/sk-scorecard-api', require('./routes/scorecardRoutes'));
