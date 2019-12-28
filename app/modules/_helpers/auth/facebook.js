const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
// const User = require('../models/users');



passport.use(new FacebookStrategy({
    //Information stored on config/auth.js
    clientID: "2453107574735287",
    clientSecret: "03ca7e905b340cad767f697704eab161",
    callbackURL: "http://localhost:8000/OhMyTennis/auth/facebook/callback",
   // profileFields: ['id', 'emails', 'displayName', 'name', 'gender'] 

}, function (accessToken, refreshToken, profile, done) {
    //Using next tick to take advantage of async properties
    process.nextTick(function () {
        // User.findOne( { where : { Email : profile.emails[0].value } }).then(function (user, err) {
        //     if(err) {
        //         return done(err);
        //     } 
        //     if(user) {
        //         return done(null, user);
        //     } else {
        //         //Create the user
        //         User.create({
        //            // userid : profile.id,
        //             //token : accessToken,
        //             FirstName : profile.displayName,
        //             Email : profile.emails[0].value,
        //             //sex : profile.gender
        //         });

        //         //Find the user (therefore checking if it was indeed created) and return it
        //         User.findOne( { where : { Email : profile.emails[0].value} }).then(function (user, err) {
        //             if(user) {
        //                 return done(null, user);
        //             } else {
        //                 return done(err);
        //             }
        //         });
        //     }
        // });
    });
})); 

module.exports = passport;