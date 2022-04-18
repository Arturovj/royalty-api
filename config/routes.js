const express = require("express");
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware')

const usersController = require('../controllers/users.controller')
const authController = require('../controllers/auth.controller')
const postsController = require('../controllers/posts.controller')

router.get('/', (req, res, next) => {
  console.log('hola');
  res.status(200).json({ ok: true })
})

/* Auth */

router.post('/login', authMiddleware.isNotAuthenticated, authController.login)

/* Users */

router.post('/users', authController.create)
router.get('/users/me', authMiddleware.isAuthenticated, usersController.getCurrentUser)
router.get('/users/:id', usersController.getUserById)
router.patch('/users/:id', usersController.updateUser)

/* Posts*/

router.post('/post/new', postsController.create)
router.get('/post/:id', postsController.detail)
router.patch('/post/:id', postsController.update)
router.delete('/post/:id', postsController.delete)

module.exports = router