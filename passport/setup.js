const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;

require('dotenv').config();

// serializing the user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserializing the user
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
})

// Local Strategy
passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        // Finding the user
        User.findOne({ email: email })
            .then(user => {

                // if no such user
                if (!user) {
                    return done("no such user!");
                }

                // Return existing user
                else {
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done("wrong password!")
                        }
                    })
                }
            })
            .catch(err => {
                done(err)
            })
    })
);


// JWT Strategy
passport.use(
    new JwtStrategy({
            secretOrKey: process.env.TOKEN,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async(token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);

module.exports = passport;