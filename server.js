const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');

const config = require('./config.json');
const connectMongoose = require('./helpers/mongoose');
const { setEnvironment } = require('./helpers/env');
const { errorHandler, responseErrorHandler } = require('./plugins/express/errorHandler');
const api = require('./routes/api');

setEnvironment(config.environment);

const PORT = config.server.port;

const createServerAsync = async () => {
  try {
    const app = express();

    // Initialize passport
    app.use(passport.initialize());

    // Configure body parser to accept json
    app.use(bodyParser.json());

    // Register handler for static assets
    app.use(express.static(path.resolve(__dirname, 'public')));

    // Register HTTP request logger
    app.use(morgan('dev'));

    // Add error handler to responses
    app.use(responseErrorHandler);

    // Register API routes
    app.use('/api', api);

    // Register custom error handler (should registered last be last)
    app.use(errorHandler);

    await connectMongoose();
    app.listen(PORT);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

createServerAsync();
