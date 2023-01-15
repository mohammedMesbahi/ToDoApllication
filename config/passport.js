const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

// load user model
const User = require("../models/User");

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, function verify(email, password, done) {
            // match user
            User.findOne({ email: email })
                .then(dbuser => {
                    if (!dbuser)
                        return done(null, false, { message: 'That email is not registered' })
                    // match password
                    bcrypt.compare(password, dbuser.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, dbuser);
                        } else {
                            return done(null, false, { message: 'Password incorrect' });
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                    done(err);
                })
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}