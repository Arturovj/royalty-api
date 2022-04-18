
const createError = require('http-errors')
const User = require('../models/User.model')

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
  .then(user => {
      if (!user) {
        // not found
        next(createError(404, 'User not found'))
      } else {
        res.status(200).json(user)
      }
    })
    .catch(next)
}

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.currentUser)
  .populate({path: 'posts', options:{sort: [{"posts": "desc"}] }})
  .sort({ posts: "desc" })
    .then(user => {
      if (!user) {
        // not found
        next(createError(404, 'User not found'))
      } else {
        res.status(200).json(user)
      }
    })
    .catch(next)
}

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(post => {
    res.status(200).json(post)
  })
  .catch(next)
}



