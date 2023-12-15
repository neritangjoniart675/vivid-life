/* sophisticated_elaborate_complex_code.js */

// This code demonstrates a complex implementation of a web application
// It includes advanced features like authentication, data persistence, and real-time messaging

// Import necessary libraries
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Create an instance of the Express framework
const app = express();

// Configure application settings
app.set('port', process.env.PORT || 3000);
app.set('secretKey', 'mySecretKeyForJWT');

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

// Create a Mongoose schema for User model
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Create a Mongoose model for User
const User = mongoose.model('User', userSchema);

// Middleware for parsing request body and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware for managing sessions using MongoDB
app.use(session({
  secret: 'mySecretSessionKey',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 86400000 } // Session expires in 24 hours
}));

// Middleware for authenticating user with JWT
function authenticate(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.sendStatus(401);
  }
}

// Mount static files directory
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    const user = new User({
      username,
      password: hash
    });

    user.save((err) => {
      if (err) throw err;
      res.sendStatus(201);
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.sendStatus(401);
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;

        if (result) {
          const token = jwt.sign({ userId: user._id }, app.get('secretKey'), { expiresIn: '1h' });
          req.session.userId = user._id;
          res.cookie('token', token, { maxAge: 3600000 });
          res.sendStatus(200);
        } else {
          res.sendStatus(401);
        }
      });
    }
  });
});

app.get('/dashboard', authenticate, (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

// Start the server
const server = app.listen(app.get('port'), () => {
  console.log('Server started on port ' + app.get('port'));
});

// Enable real-time messaging using Socket.IO
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('chat message', (msg) => {
    console.log('Message received: ' + msg);
    io.emit('chat message', msg);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Close database connection on process exit
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
