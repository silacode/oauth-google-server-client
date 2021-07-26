//...................................... Imports ..........................................
require("dotenv").config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");

//user model
const User = mongoose.model("User");

//serialize and deserialize user into cookie
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id, (err, user) => done(err, user))
);
//Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    (accessToken, refreshToken, profile, cb) => {
      //     const foundUser = await User.findOne({ googleId: profile.id });
      //     if (foundUser) cb(null, foundUser);
      //     else {
      //       try {
      //         const newUser = new User({ googleId: profile.id });
      //         await newUser.save();
      //         cb(null, newUser);
      //       } catch (err) {
      //         return res.status(422).send(err.message);
      //       }
      //     }
      //   }
      // )
      console.log(profile);
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) cb(null, existingUser);
        else {
          new User({
            googleId: profile.id,
            username: profile.displayName,
            picture: profile._json.picture,
          })
            .save()
            .then((user) => cb(null, user));
        }
      });
    }
  )
);
