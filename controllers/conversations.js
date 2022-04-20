const router = require("express").Router();
const Conversation = require("../models/Conversation");

router.post("/", (req,res) => {
    const newConversation = new Conversation({
        members:[req.body.senderId, req.body.receiverId]
    });

    try{

    }catch(err){
        res.status(500).json(e)
    }
    
})

module.exports = router