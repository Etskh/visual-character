// TODO: make this Es20115 syntax
const path = require('path');
const express = require('express');
const hbs = require('express-hbs');

// Local modules
const logger = require('./lib/logger');
const apiRoute = require('./routes/api');
const authRoute = require('./routes/auth');

// Create the app
const app = express();

// Set up static assets
app.use(express.static('public'));

// Set up templating engine
app.engine('html', hbs.express4());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../views'));

// App configuration
const config = {
  name: 'Visual Character',
  description: 'A system agnostic RPG character manager',
  version: '0.0.10',
  port: process.env.PORT || 3000,
};

// Add logging to each route
app.use((req, res, next) => {
  logger.info({
    request: req.originalUrl,
    resolve: req.path,
    origin: req.ip === '::1' ? 'localhost' : req.ip,
  });
  next();
});

// Main route
app.get('/', (req, res) => {
  res.render('index', {
    title: config.name,
    description: config.description,
    isProduction: (process.env.NODE_ENV === 'production'),
  });
});

app.use('/auth', authRoute);
app.use('/api', apiRoute);


// Listen on configured port
app.listen(config.port, () => {
  logger.info(`${config.name} version ${config.version} running on port ${config.port}`);
});
