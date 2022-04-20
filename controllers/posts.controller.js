const Post = require('../models/Post.model')

module.exports.create = (req, res, next) => {
  const post = { user, description } = req.body
  Post.create(post)
    .then(post => res.status(200).json(post))
    .catch(next)
}

module.exports.detail = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(next)
}

module.exports.update = (req, res, next) => {
  console.log('hola?', req.params.id)
  Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(post => {
      console.log(post, req.body)
      res.status(200).json(post)
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then(post => res.status(202).json(post))
    .catch(next)
}