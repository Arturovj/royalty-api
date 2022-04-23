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

router.post('/users',upload.single('image'), authController.create)
router.get('/users', authMiddleware.isAuthenticated, usersController.list)
router.get('/users/me', authMiddleware.isAuthenticated, usersController.getCurrentUser)
router.get('/users/:id', usersController.getUserById)
router.patch('/users/:id', usersController.updateUser)

/* Posts*/

router.post('/post/new',upload.single('image'), authMiddleware.isAuthenticated, postsController.create)
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

// get conversation includes two userId

router.get("/conversations/find/:firstUserId/:secondUserId", async (req, res) =>{
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (error) {
    res.status(500).json(err)
  }
})


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
router.get("/users/friends/:userId", async (req, res) => {
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

router.put("/users/me/follow", authMiddleware.isAuthenticated, async (req, res, next) => {
  if (req.body.userId !== req.currentUser) {
    try {
      const user = await User.findById(req.currentUser);
      
      if (!user.followings.includes(req.body.userId)) {
        user.followings.push(req.body.userId)
        await user.save()
        await User.findByIdAndUpdate(req.body.userId, { $push: { followers: req.currentUser} });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
     next(err)
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/users/me/unfollow",  authMiddleware.isAuthenticated, async (req, res, next) => {
  if (req.body.userId !== req.currentUser) {
    try {
      const user = await User.findById(req.currentUser);

      if (user.followings.includes(req.body.userId)) {
        user.followings = user.followings.filter((id) => id !== req.body.userId)
        await user.save()
        await User.findByIdAndUpdate(req.body.userId, { $pull: { followers: req.currentUser } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      next(err)
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});


module.exports = router



