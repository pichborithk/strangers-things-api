const express = require('express');
const mongoose = require('mongoose');

const { config } = require('./config/config');
const Logging = require('./library/Logging');

const server = express();

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    Logging.info('Connected to MongoDB');
    StartServer();
  })
  .catch(error => {
    Logging.error('Unable to connect: ');
    Logging.error(error);
  });

const StartServer = () => {
  server.use((req, res, next) => {
    Logging.info(
      `Incoming -> Method: [${req.method}] - url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
      Logging.info(
        `Incoming -> Method: [${req.method}] - url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });

    next();
  });

  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());

  // Rules of our API
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method == 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
      );
      return res.status(200).json({});
    }

    next();
  });

  /** Routes */
  // server.use('/authors', authorRoutes);
  // server.use('/books', bookRoutes);

  /** Health Check */
  server.get('/ping', (req, res, next) =>
    res.status(200).json({ message: 'Hello Server' })
  );

  /** Error handling */
  server.use((req, res, next) => {
    const error = new Error('Not found');

    Logging.error(error);

    return res.status(404).json({
      message: error.message,
    });
  });

  server.listen(config.server.port, () =>
    Logging.info(`Server is running on port ${config.server.port}`)
  );
};
