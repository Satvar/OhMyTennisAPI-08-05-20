const passport = require('passport')
const InstaStrategy = require('passport-instagram').Strategy;
// const User = require('../models/users');
passport.use(new InstaStrategy({
    clientID: "4659ff6ea0b9467ba9dd651d6de29f47",
    clientSecret: "68c32c43966144b88ddbb57e39c20baa",
    callbackURL: "http://localhost:8000/OHmyTennis/auth/instagram/callback"
  }, (accessToken, refreshToken, profile, done) => {
      let user = {};
    //   User.FirstName = profile.displayName;
    //   user.image = profile._json.data.profile_picture;
     // user.bio = profile._json.data.bio;
     // user.media = `https://api.instagram.com/v1/users/${profile.id}/media/recent/?access_token=${accessToken}&count=8`
  
      done(null, user)  
  }))