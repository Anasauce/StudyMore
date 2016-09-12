import express from 'express'
const router = express.Router()

const subjects = [ 
      {
        title: 'Math'
      },
      {
        title: 'Read'
      }
  ]

/* GET home page. */
router.get('/new', (req, res, next) => {
  res.render('create_card', { subject:  subjects }) 
})

module.exports = router 
