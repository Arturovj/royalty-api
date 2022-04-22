const express = require("express");
const router = express.Router();
const upload = require('../config/storage.config')
const Conversation = require("../models/Conversation.model");
const Message = require("../models/Message.model")
const User = require('../models/User.model')



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
router.get('/users', authMiddleware.isAuthenticated, usersController.list)
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




//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, name, avatar } = friend;
      friendList.push({ _id, name, avatar });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});


module.exports = router



