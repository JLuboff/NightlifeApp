const yelp = require('yelp-fusion');

module.exports = (app, passport, db) => {


  app.route('/')
    .get((req, res) => {
      var user, avatar, location;
      if(req.user !== undefined){
      user = `${req.user._json.first_name} ${req.user._json.last_name}`;
      avatar = req.user._json.picture.data.url;
    };
    location = req.session.location !== undefined ? req.session.location : undefined;
    console.log(req.session);
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
      db.collection('location').find({city}).toArray((err, doc) => {
        if (err) throw err;
        console.log(`Found...: ${doc}`);
        if(doc.length){
        console.log(`Check`);
        return res.json(doc);
      } else {
        yelp.accessToken('dNlo7ZOX2VzRimvxUmEiXA', 'jhrkuiwW1U4kfgSarByzubXNTOecaWDTorHJv3GPKle4rYA60pmamqd55uXGQhT7')
                              .then(response => {
                                //console.log(response.jsonBody.access_token);
  const client = yelp.client(response.jsonBody.access_token);

                                client.search({
                                  term: 'Bar',
                                  location: city
                                }).then(response => {
                                  let businesses = [];

                                  response.jsonBody.businesses.forEach(biz => {
                                    let business = {};
                                    business['city'] = city;
                                    business['name'] = biz.name;
                                    business['image'] = biz.image_url;
                                    business['rating'] = biz.rating;
                                    business['count'] = 0;
                                    businesses.push(business);
                                  })
                                  db.collection('location').insertMany(businesses, (err, doc) => {
                                    if(err) throw err;

                                  console.log(`Had to insert..: ${JSON.stringify(doc)}`);

                              res.json(doc.ops);
                                    });
                                }).catch(e => {console.log(e)});
                              }).catch(e=> {console.log(e)});
      }
      })

    })

  app.route('/going/:city/:locationName')
  /*  .get((req, res) => {
      let city = req.params.city.toLowerCase();
      console.log('Request recieved: ' + city + " " + req.params.locationName);
      db.collection('location').updateOne({city, bar: req.params.locationName},
            {$inc:{ count : 1}},
            {upsert: true });

    return;
  }) */
    .post((req, res) => {
      let city = req.params.city.toLowerCase();
    /*  db.collection('location').updateOne({city: city, name: req.params.locationName},
            {$inc:{ count : 1}},
            {upsert: true });
      db.collection('location').findOne({city: city, name: req.params.locationName}, (err, doc) => {
        if(err) throw err;

        res.json(doc);
      }) */
        console.log("City: " + city + " Name: " + req.params.locationName)
      db.collection('location').findOneAndUpdate({city: city, name: req.params.locationName},
              {$inc:{ count : 1}},
              {upsert: true, returnOriginal: false }, (err, doc) => {
                if(err) throw err;
                  console.log(doc);
                res.json(doc.value);
              })
    })
};
