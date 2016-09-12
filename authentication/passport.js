import passport from 'passport'
import { Strategy } from 'passport-local'
import { User } from '../database/db'

const FIELDS = {
  usernameField: 'email',
  passwordField: 'password'
}

const strategy = new Strategy( FIELDS, (email, password, done) => {
  User.find( email, password )
    .then( result => {
      if( result.length === 0 ) {
        return done( null, false, { message: 'Incorrect email or password.' })
      } else {
        return done( null, result[ 0 ] )
      }
    })
    .catch( error => done( error ))
})

passport.use( strategy )

passport.serializeUser( (user, done) => {
  done( null, user.id )
})

passport.deserializeUser( (id, done) => {
  User.findById( id )
    .then( user => done( null, user ))
    .catch( error => done( error ))
})

const checkAuthentication = () => (request, response, next ) => {
  if( request.isAuthenticated() ) {
    return next()
  } else {
    response.redirect( '/users/login' )
  }
}

export { passport as default, checkAuthentication }