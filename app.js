const express = require('express'),
      routes = require('./routes/routes'),
      hbs = require('hbs'),
      MongoClient = require('mongodb').MongoClient,
      session = require('express-session'),
      yelp = require('yelp-fusion'),
      //parseurl = require('parseurl'),
      //flash = require('connect-flash'),
      dotenv = require('dotenv'),
      passport = require('passport'),
      FacebookStrategy = require('passport-facebook').Strategy,
      port = process.env.PORT || 3000;

passport.use(new FacebookStrategy({
        clientID: '1176761465763405',
        clientSecret: 'dce5221348dadd3b375e1f4bc5694b9e',
        callbackURL: 'http://127.0.0.1:3000/auth/facebook/callback',
        profileFields: ['hometown', 'location', 'picture', 'name']
      }, (accessToken, refreshToken, profile, cb) => {
        if(profile) {
          user = profile;
          return cb(null, user);
        } else {
          return done(null, false);
        };
      }
    ));

passport.serializeUser((user, cb) => {
      cb(null, user);
    });
passport.deserializeUser((obj, cb) => {
      cb(null, obj);
    });

var app = express();

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'Party Hard',
  resave: true,
  saveUnitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

MongoClient.connect(`mongodb://localhost:27017/bars`, (err, db)=>{
  if(err) throw err;

routes(app, passport, db);

app.listen(port, () => {

  console.log(`Listening on port: ${port}`);
});
});
