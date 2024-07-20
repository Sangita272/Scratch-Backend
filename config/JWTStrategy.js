const passport = require("passport");
const passportJwt = require("passport-jwt");
const User = require("../models/user.model.js");

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

// Create JWT strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    (jwtPayload, done) => {
      if (jwtPayload.exp < Date.now() / 1000) {
        return done(null, false, { expired: true });
      }
      if (!jwtPayload.email) {
        return User.findOne({ username: jwtPayload.username })
          .select("-password -refreshTokens")
          .then((user) => {
            return done(null, user);
          })
          .catch((err) => {
            return done(err);
          });
      } else {
        return User.findOne({ email: jwtPayload.email })
          .select("-password -refreshTokens")
          .then((user) => {
            return done(null, user);
          })
          .catch((err) => {
            return done(err);
          });
      }
    }
  )
);
