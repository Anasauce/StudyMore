import express from 'express'
const router = express.Router()

import passport, { checkAuthentication } from '../authentication/passport'

import { User } from '../database/db'

const OPTIONS = {
  successRedirect: '/users/dashboard',
  failureRedirect: '/users/login'
}

router.get( '/login', (request, response) => {
  response.render( 'login' )
})

router.post( '/login', passport.authenticate( 'local', OPTIONS ) )

router.post( '/signup', (request, response) => {
  const { name, email, password } = request.body

  User.signUp( name, email, password )
    .then( user => response.redirect( '/users/dashboard' ))
    .catch( error => response.redirect( '/' ))
})

router.get( '/dashboard', checkAuthentication(), (request, response) => {
  response.render( 'dashboard' )
})

// TODO: Figure out why I can't use ES6 export statement
module.exports = router