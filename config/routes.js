const express = require("express");
const router = express.Router();
const upload = require('../config/storage.config')
const Conversation = require("../models/Conversation.model");
const Message = require("../models/Message.model")



// upload.single('image')

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


/* Conversations */


router.post("/conversations", async (req,res) => {
    const newConversation = new Conversation({
        members:[req.body.senderId, req.body.receiverId]
    });

    try{
        const savedConversation = await newConversation.save()
        res.status(200.).json(savedConversation)
    }catch(err){
        res.status(500).json(err)
    }
});

router.get("/conversations/:userId", async (req,res) => {
  try{
    const conversation = await Conversation.find({
      members: { $in:[req.params.userId] },
    });
    res.status(200).json(conversation)
  }catch(err){
    res.status(500).json(err)
}

});

/* Messages */

router.post("/messages", async (req,res) => {
   const newMessage = new Message(req.body)
   try{
    const savedMessage = await newMessage.save()
    res.status(200).json(savedMessage)
  }catch(err){
    res.status(500).json(err)
}

})

router.get("/messages/:conversationId", async (req,res) => {
  try{
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
    res.status(200).json(messages)

  }catch(err){
    res.status(500).json(err)
  }
})


module.exports = router