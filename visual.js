'use strict'

var express = require('express')
var nunjucks = require('nunjucks')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

var app = express()

const userAuth = require('./server/user')



const secret_key = 'asdf'

nunjucks.configure('templates', {
  autoescape: true,
  express: app
})
app.use(cookieParser())
app.use(bodyParser.json())

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const logRequest = function(req, res, next) {
  console.log([
    new Date().toISOString(),
    req.method,
    req.route.path,
    JSON.stringify(req.query)
  ].join(' - '))
  next()
}

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


app.post('/login', logRequest, urlencodedParser, function (req, res) {
  userAuth.authenticate(
    req.body.username,
    req.body.password
  ).then( function(user) {
    res.cookie('user', user.name)
    res.locals.user = user
    return res.redirect('/')
  }, function(error) {
    console.log('uh oh: ' + error)
    return res.render('uhoh.html')
  })
})

app.get('/logout', logRequest, function(req, res) {
  res.clearCookie('user')
  return res.redirect('/')
})




app.get('/', logRequest, userAuthenticated, function (req, res) {
  const user = res.locals.user
  user.getCharacters(
    // empty
  ).then(function(characters) {
    res.render('index.html', {
      characters: characters,
    })
  }, function(error){
    return res.render('uhoh.html', { error: error })
  })
})



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
