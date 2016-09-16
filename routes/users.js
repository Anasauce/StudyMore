import express from 'express'
const router = express.Router()

import passport, { checkAuthentication } from '../authentication/passport'

import { User, Subject, Card } from '../database/db'

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
  const { id, name } = request.user

  Promise.all([ Subject.findById(id) ])
    .then(result => {
      const [ subjects ] = result
      const subjectIds = subjects.map(subject => subject.id)

      Promise.all([ Card.findCardsBySubjectIds(subjectIds) ])
        .then( data => {
          const [ cards ] = data

          subjects.forEach(subject => {
            subject.cards = cards.filter(card => card.subject_id === subject.id).length
          })

          response.render('dashboard', { subject:  subjects, username: name, loggedIn: request.user !== undefined })
        })
    })
    .catch(error => {
      response.send({message: error.message})
    })
})

// TODO: Figure out why I can't use ES6 export statement
module.exports = router
