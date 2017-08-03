const yelp = require('yelp-fusion');

module.exports = (app, passport, db) => {
  const isLogged = (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    return res.redirect('/login');
  };

  app.route('/')
  .get((req, res) => {
    var user, avatar, location;
    if(req.user !== undefined){
      user = `${req.user._json.first_name} ${req.user._json.last_name}`;
      avatar = req.user._json.picture.data.url;
    };
    location = req.session.location !== undefined ? req.session.location : undefined;
    res.render('index.hbs', {user, avatar, location});
  });

  app.route('/auth/facebook/callback')
  .get(passport.authenticate('facebook', { failureRedirect: '/'}),(req, res) =>{
    res.redirect('/');
  });

  app.route('/login')
  .get(passport.authenticate('facebook'));

  app.route('/logout')
  .get((req,res) => {
    req.logout();
    res.redirect('/');
  });

  app.route('/:location')
  .get((req, res) => {
    req.session.location = req.params.location;
    let city = req.session.location.toLowerCase();
    db.collection('location').find({city}).sort({count: -1}).toArray((err, doc) => {
      if (err) throw err;

      if(doc.length){
        return res.json(doc);
      } else {
        yelp.accessToken('dNlo7ZOX2VzRimvxUmEiXA', 'jhrkuiwW1U4kfgSarByzubXNTOecaWDTorHJv3GPKle4rYA60pmamqd55uXGQhT7')
        .then(response => {
          const client = yelp.client(response.jsonBody.access_token);

          client.search({
            term: 'Bar',
            location: city
          }).then(response => {
            let businesses = [];
            response.jsonBody.businesses.forEach(biz => {

              let business = {};
              business['city'] = city;
              business['address'] = biz.location.address1 + " " + biz.location.address2;
              business['zip'] = biz.location.zip_code;
              business['state'] = biz.location.state;
              business['name'] = biz.name;
              business['image'] = biz.image_url;
              business['rating'] = biz.rating;
              business['count'] = 0;
              business['user'] = [];
              businesses.push(business);
            })

            db.collection('location').insertMany(businesses, (err, doc) => {
              if(err) throw err;

              res.json(doc.ops);
            });
          }).catch(e => {console.log(e)});
        }).catch(e=> {console.log(e)});
      }
    })
  });

  app.route('/going/:city/:locationName')
  .post(isLogged, (req, res) => {
    let city = req.params.city.toLowerCase();
    let user = `${req.user._json.first_name} ${req.user._json.last_name}`;
    let avatar = req.user._json.picture.data.url;

    db.collection('location').findOne({city: city, name: req.params.locationName, user: {$elemMatch: {$elemMatch: {$in: [user]}}}}, (err, doc) => {
      if(err) throw err;
      if(doc){
        db.collection('location').findOneAndUpdate({city: city, name: req.params.locationName},
          {$inc:{ count : -1}, $pull: {user: { $in: [user] } }},
          {upsert: true, returnOriginal: false, sort: { count: -1} }, (err, doc) => {
            if(err) throw err;
            return res.json(doc.value);
          })
        } else {
          db.collection('location').findOneAndUpdate({city: city, name: req.params.locationName},
            {$inc:{ count : 1}, $addToSet: {user: [user, avatar]}},
            {upsert: true, returnOriginal: false,  sort: { count: -1} }, (err, doc) => {
              if(err) throw err;
              return res.json(doc.value);
            })
          };
        })
      });
    };
