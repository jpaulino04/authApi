const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt  = require('passport-jwt').ExtractJwt;
const mongoose    = require('mongoose');
const User        = mongoose.model('User');
const keys        = require('../config/keys');

const opts = {};
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey; //Recall: secreOrKey was use to create the token

//regular response with callback
module.exports = passport => {
  passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
      .then( user => {
        if(user){
          //At this point the full request has been made
          return done(null, user)
        }
        return done(null, false)
      })
      .catch(err => console.log(err))
  }))
}



