const express = require('express')
const router = express.Router()
const mongoose = ('mongoose')
const requireLogin = require('../middleware/requireLogin')
//const { post } = require('./auth')
const Post = mongoose.model("Post")

router.get('/allpost', requireLogin,(req,res) => {
    Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postBy", "_id name")
    .sort('-createdAt')
    .then((posts) => {
        res.json({posts})
    }).catch(err => {
        console.log(err)
    })
})
router.get('getsubpost', requireLogin, (req,res) => {
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort('-createdAt')
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err)
    })
})
router.post('/createPost', requireLogin, (req,res) => {
    const {title, body, pic} = req.body
        if(!title || !body || !pic) {
            return res.status(422).json({error: "Please add all fields"})
        }
        req.user.password = undefined
            const post = new Post({
                title,
                body,
                photo:pic,
                postedBy:req.user
            })
            post.save().then(result =>{
                res.json({post:result})
            })
            .catch(err => {
                console.log(err)
            })
})
router.put('/like', requireLogin, (req,res) => {
    Post.findByIdandUpdate(req.body.postId, {
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result) => {
        if (err) {
            return res.status(422).json({error:err})
        }else {
            res.json(result)
        }
    })
})
router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdandUpdate(req.body.postId, {
        $pull:{likes:req.user._id}
    }, {
        new:true
    }).exec((err,result) => {
        if (err) {
            return res.status(422).json({error:err})
        }else {
            res.json(result)
        }
    })
})
router.put('/comment', requireLogin, (req,res) => {
    const comment = {
        text:req.body.text,
        postedBy:req.user_id
    }
    Post.findByIdandUpdate(req.body.postId, {
        $push:{comments:comment}
    }, {
        new:true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({error:err})
        }else {
            res.json(result)
        }
    })
})
router.delete('/deletepost', requireLogin, (req, res) => {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if (err || !post) {
            return res.status(422).json({error:err})
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(result => {
                res.json(result)
            }).catch(err => {
                console.log(err)
            })
        }
    })
})

module.exports = router