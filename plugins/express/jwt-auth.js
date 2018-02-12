const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');

const config = require('../../config.json');
const { InternalServerError } = require('../../error/httpStatusCodeErrors');

const params = {
  secretOrKey: config.authentication.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

/**
 * JWT strategy that will extend response with a new user property containing the id
 */
const strategy = new Strategy(params, (payload, done) => {
  if (payload.userId) {
    return done(null, {
      id: payload.userId,
    });
  }

  return done(new InternalServerError());
});

passport.use(strategy);

module.exports = passport.authenticate('jwt', { session: false });
