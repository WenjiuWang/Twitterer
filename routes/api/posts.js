const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');


// @route    POST api/posts
// @desc     Create a new post
// @access   Private
router.post('/', auth,
    check('text', 'Tweet cannot be empty').notEmpty(),
    check('text', 'Tweet exceed 280 characters').isLength({max: 280}),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const user = await User.findById(req.user.id).select('-password');
  
        const newPost = new Post({
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id
        });
  
        const post = await newPost.save();
  
        res.json(post);
      } catch (err) {
        res.status(500).send('Server Error');
      }
    }
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
      const posts = await Post.find().sort({ date: -1 });
      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route    GET api/posts/:id
// @desc     Get posts with post id
// @access   Private
router.get('/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Tweet not found' });
      }
  
      res.json(post);
    } catch (err) {
      console.error(err.message);
  
      res.status(500).send('Server Error');
    }
  });


// @route    POST api/posts/:id
// @desc     Update a Tweet
// @access   Private
router.post('/:id', auth,
    check('text', 'Tweet cannot be empty').notEmpty(),
    check('text', 'Tweet exceed 280 characters').isLength({max: 280}),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
            return res.status(404).json({ msg: 'Tweet not found' });
            }

            if (post.user.toString() !== req.user.id) {
                return res.status(404).json({ msg: 'Not authorized to edit' });
            }

            await Post.updateOne({"_id": req.params.id}, { $set: {"text": req.body.text}});

            res.json({ msg: "Tweet updated" });
    
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
);

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete('/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({ msg: 'Tweet not found' });
      }
  
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized to delete' });
      }
  
      await post.remove();
  
      res.json({ msg: 'Tweet removed' });
    } catch (err) {
      console.error(err.message);
  
      res.status(500).send('Server Error');
    }
  });



  module.exports = router;