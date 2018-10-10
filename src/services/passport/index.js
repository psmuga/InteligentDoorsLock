import passport from 'passport'
import { BasicStrategy } from 'passport-http'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { jwtSecret } from '../../config'
import User, { schema } from '../../api/user/model'

export const password = () => (req, res, next) =>
    passport.authenticate('password', { session: false }, (err, user, info, email) => {
        if (err && err.param) {
            return res.status(400).json(err)
        } else if (err || !user) {
            return res.status(401).end()
        }
        req.logIn(user, { session: false }, (err) => {
            if (err) return res.status(401).end()
            next()
        })
    })(req, res, next)

export const master = () =>
    passport.authenticate('master', { session: false })

export const token = ({ required, roles = User.roles } = {}) => (req, res, next) =>
    passport.authenticate('token', { session: false }, (err, user, info) => {
        if (err || (required && !user) || (required && !~roles.indexOf(user.role))) {
            return res.status(401).end()
        }
        req.logIn(user, { session: false }, (err) => {
            if (err) return res.status(401).end()
            next()
        })
    })(req, res, next)

passport.use('password', new BasicStrategy({passReqToCallback: true}, (req, email, password, done) => {
    if(!email || !password) done(err)         // You can use more sophisticated checks here

    User.findOne({ email }).then((user) => {
        if (!user) {
            done(true)
            return null
        }
        return user.authenticate(password, user.password).then((loggedUser) => {
            done(null, loggedUser)
            return null
        }).catch(done)
    })
}))

passport.use('master', new BearerStrategy((token, done) => {
    console.log(token)
    if (token === masterKey) {
        done(null, {})
    } else {
        done(null, false)
    }
}))

passport.use('token', new JwtStrategy({
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer')
    ])
}, ({ id }, done) => {
    User.findById(id).then((user) => {
        done(null, user)
        return null
    }).catch(done)
}))
