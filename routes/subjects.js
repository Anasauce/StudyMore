import express from 'express'
const router = express.Router()

import { Subject } from '../database/db'

/* GET home page. */
router.get('/new', (req, res, next) => {

  res.render('create_subject')
})

/* GET home page. */
router.post('/create-subject', ( request, response ) => {
  const { id } = request.user
  const { title } = request.body 

  console.log('Data', id, title)

  Subject.create( title, id ).then( result => {

    console.log( 'Subject Result', result )
    
    res.send(result)
    // res.redirect(`/subjects/${}`, { result })
  })

})

module.exports = router
