//required libraries
const passport = require('passport');
//require bcrypt
const bcrypt = require('bcrypt');

//require sha1 and HEX from crypto-js
const sha1 = require('crypto-js/sha1');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');

const Test = require('../../models/test');
const Utils = require('../utils');

//local files
const { JWT_SECRET } = require('../../config/index');

//JWT STRATEGY

//TODO:
//1- Validate token[*]
//2- Search user[*]
//3- return user or Forbidden[*]
//4- implement in a demo api[*]
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        // finding the user by user_id saved in token (payload.sub)
        // Find the user given the username
        const results = await Test.testModel({ username: payload.sub });
        // Get the user from the results array
        const user = results[0];
        // [*]
        // check if exists
        if (!user) {
          //handle not found
          return done('User not found');
        }
        //return user
        done(null, user);
      } catch (e) {
        done(e, false);
      }
    },
  ),
);

//LOCAL STRATEGY

//TODO:
//1- Search user[*]
//2- If user's password is older sha1 has change it to bcrypt and save in db
//3- Compare password
//3- return user or Unauthorized[*]

passport.use(
  //local strategy uses Username
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        // Find the user given the username
        const results = await Test.testModel({ username });
        // Get the user from the results array
        const user = results[0];
        // If not, handle it
        if (!user) {
          return done(null, false);
        }
        // Check if the user's password is new bcrypt password
        if (user.password.startsWith('$2')) {
          // Check if the password is correct
          const isMatch = await bcrypt.compare(password, user.password);
          // Handle if password isn't correct
          if (!isMatch) {
            return done(null, false);
          }
          // Otherwise, return the user
          done(null, user);
        } else {
          // Since the user's password is not bcrypt version it must be the older sha1 hash
          // Check if password is correct
          // Compare using sha1
          const isMatch = await (sha1(password).toString() === user.password);
          // Handle if password isn't correct
          if (!isMatch) {
            return done(null, false);
          }
          if (isMatch) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await Utils.changeSha1PassToBcrypt(user, hashedPassword);
            // Return the user
            done(null, user);
          }
        }
      } catch (error) {
        done(error, false);
      }
    },
  ),
);
