import express from 'express'
const router = express.Router()

import { Subject, Card, Quiz } from '../database/db'


router.get('/new', ( request, response ) => {
  response.render('subjects/create')
})

router.post('/create-subject', ( request, response ) => {
  const { id } = request.user
  const { title } = request.body

  Subject.create( title, id ).then( result => {
    response.redirect(`/subjects/${result.id}`)
  })
})

router.get('/:id', (request, response, next ) => {
  const { id } = request.params
  const query = [ Subject.find( id ), Card.findBySubjectId( id ) ]

  Promise.all( query )
  .then( result => {
    const [ subject, cards ] = result
    response.render( 'subjects/dashboard', { subject, cards } )
  })
})

router.get('/edit/:subject_id', ( request, response ) => {
  const { subject_id } = request.params

  response.render('subjects/edit', { subject_id })
})

router.post('/edit/:subject_id', ( request, response ) => {
  const { subject_id } = request.params
  const { title } = request.body

  Subject.update( title, subject_id ).then( result => {
    response.redirect(`/subjects/${subject_id}`)
  })
})

router.get('/delete/:subject_id', ( request, response ) => {
  const { subject_id } = request.params

  Subject.delete( subject_id ).then( () => {
    response.redirect('/users/dashboard')
  })
  .catch( error => { message: error.message })
})

router.get( '/:id/study', (request, response) => {
  const user_id = request.user.id
  const { id } = request.params

  Quiz.create( user_id, id )
    .then( result => response.redirect( `/quiz/${result[0]}/0` ))
})

module.exports = router
