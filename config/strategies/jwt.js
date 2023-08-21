const passportJWT = require('passport-jwt')
const { User } = require('../../models')

const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

module.exports = passport => {
    // 認證JWT
    passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
        User.findByPk(jwtPayload.id, {
        })
            .then(user => {
                if (!user) return done(null, false)
                return done(null, user)
            })
            .catch(err => done(err))
    }))
}