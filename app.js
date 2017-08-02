const express = require('express'),
      routes = require('./routes/routes'),
      hbs = require('hbs'),
      MongoClient = require('mongodb').MongoClient,
      session = require('express-session'),
      yelp = require('yelp-fusion'),
      passport = require('passport'),
      FacebookStrategy = require('passport-facebook').Strategy,
      port = process.env.PORT || 3000;

passport.use(new FacebookStrategy({
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL: process.env.CALLBACKURL,
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
app.use(session({
  secret: process.env.SESSIONSECRET,
  resave: true,
  saveUnitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

MongoClient.connect(`mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASS}@ds034677.mlab.com:34677/bars`, (err, db)=>{
  if(err) throw err;

routes(app, passport, db);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
});
