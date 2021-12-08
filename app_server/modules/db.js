const mongoose = require('mongoose');
const readLine = require('readline');

let dbURL = 'mongodb://127.0.0.1/SPA4Scrum';
if (process.env.NODE_ENV === 'production') {
  dbURL = process.env.DB_HOST || process.env.MONGODB_URI;
}

const connect = () => {
  mongoose.connect(dbURL, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
  });
};

mongoose.connection.on('connected', () => {
  console.log('connected');
});

mongoose.connection.on('error', err => {
  console.warn('error: ' + err);
  console.log('Try to reconnect...');
  setTimeout(connect, 1000);
  return connect();
});

mongoose.connection.on('disconnected', () => {
  console.log('disconnected');
});

if (process.platform === 'win32')
  readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  }).on ('SIGINT', () => {
    process.emit("SIGINT");
  });

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});

connect();

require('./projects.js');
require('./user.js');
