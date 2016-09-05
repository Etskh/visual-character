'use strict'

const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const log = require('winston').log


const app = express()

app.locals.title = 'Visual Character'
// Since Heroku randomly assigns a part on
app.locals.port = process.env.PORT || 3000

// Configure the template middleware
nunjucks.configure('templates', {
  autoescape: true,
  express: app
})


// Use the public directory
app.use(express.static('public'))

// Use cookie parsing middleware
app.use(cookieParser())

// Use form parsing middleware
app.use(bodyParser.urlencoded({ extended: false }))

// Log extra commands on each go
app.use(function(req, res, next) {

  log('info', 'request', {
    time: new Date().toISOString(),
    method: req.method,
    path: req.route ? req.route.path : '/',
    query: JSON.stringify(req.query),
    body: req.body,
  })
  next()
})




const userAuth = require('./server/lib/user')

const userAuthenticated = function( req, res, next ) {
  if( !req.cookies.user ) {
    return res.render('login.html')
  }
  userAuth.getByName(req.cookies.user).then(function(user) {
    res.locals.user = user
    next()
  }, function(error) {
    // TODO: Make this an approchable error screen
    return res.render('uhoh.html', { error: error })
  })
}

// No user-authentication needed
app.post('/login', function (req, res) {
  userAuth.authenticate(
    req.body.username,
    req.body.password
  ).then( function(user) {
    res.cookie('user', user.name)
    res.locals.user = user
    return res.redirect('/')
  }, function(error) {
    // TODO: Make this an approchable error screen
    return res.render('uhoh.html', { error: error })
  })
})

// No user-auth needed, but handy for stuff
app.get('/logout', function(req, res) {
  res.clearCookie('user')
  return res.redirect('/')
})

// Need user-auth for all routes
app.use('/', userAuthenticated, require('./server/init/routes'))


app.listen(app.locals.port, function () {
  const os = require('os')
  log('info', [
    'Starting ',
    app.locals.title, ' at ', os.hostname(), ':', app.locals.port
  ].join(' '))
})
