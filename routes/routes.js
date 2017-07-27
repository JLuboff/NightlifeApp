const yelp = require('yelp-fusion');

module.exports = (app, passport) => {


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

      console.log('Stored location: ' + req.session.location);
      yelp.accessToken('dNlo7ZOX2VzRimvxUmEiXA', 'jhrkuiwW1U4kfgSarByzubXNTOecaWDTorHJv3GPKle4rYA60pmamqd55uXGQhT7')
                            .then(response => {
                              //console.log(response.jsonBody.access_token);
const client = yelp.client(response.jsonBody.access_token);

                              client.search({
                                term: 'Bar',
                                location: req.params.location
                              }).then(response => {
                                let names = [];

                                response.jsonBody.businesses.forEach(biz => {
                                  names.push(biz.name);
                                })

                                //console.log(response.jsonBody);
                                console.log(`Names of Businesses: ${names}`);
                                  res.json(names);
                              }).catch(e => {console.log(e)});
                            }).catch(e=> {console.log(e)});
    })

};
