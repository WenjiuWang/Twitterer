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

// @route    Post api/posts/comment:id
// @desc     Comment on a post with :id
// @access   Private
router.post('/comment/:id', auth,
    check('text', 'Comment cannot be empty').notEmpty(),
    check('text', 'Tweet exceed 140 characters').isLength({max: 140}),
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

        const user = await User.findById(req.user.id).select('-password');
        
        const newComment = {
          user: req.user.id,
          text: req.body.text,
          name: user.name,
          avatar: user.avatar
        };
        
        post.comments.push(newComment);

        const updatedPost = await post.save();
  
        res.json(updatedPost);
      } catch (err) {
        res.status(500).send('Server Error');
      }
    }
);

// @route    Post api/posts/comment/:postid/:commentid
// @desc     Edit a comment with :commentid on a post with :postid
// @access   Private
router.post('/comment/:postid/:commentid', auth,
    check('text', 'Comment cannot be empty').notEmpty(),
    check('text', 'Tweet exceed 140 characters').isLength({max: 140}),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const post = await Post.findById(req.params.postid);
        if (!post) {
          return res.status(404).json({ msg: 'Tweet not found' });
        }

        const found = post.comments.findIndex(e => e.id === req.params.commentid);

        if (found === -1) {
          return res.status(404).json({ msg: 'Comment not found' });
        }

        post.comments[found].text = req.body.text;   
      
        const updatedPost = await post.save();
  
        res.json(updatedPost);
      } catch (err) {
        res.status(500).send('Server Error');
      }
    }
);

// @route    DELETE api/posts/comment/:postid/:commentid
// @desc     Delete a comment with Lcommentid on a post with :postid
// @access   Private
router.delete('/comment/:postid/:commentid', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postid);

    if (!post) {
      return res.status(404).json({ msg: 'Tweet not found' });
    }

    const found = post.comments.findIndex(e => e.id === req.params.commentid);

    if (found === -1) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    console.log(req.user.id);
    console.log(post.comments[found].user);
    console.log(post.user);


    if ((post.comments[found].user.toString() !== req.user.id) && (post.user.toString() !== req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized to delete' });
    }

    post.comments.splice(found, 1);

    await post.save();

    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/like/:id
// @desc    Like post with :id
// @access  Private
router.post('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Tweet not found' });
    }

    post.likes.push(req.user.id);   
  
    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (err) {
    res.status(500).send('Server Error');
  }
})


// @route   DELETE api/posts/like/:id
// @desc    Delete like on post with :id
// @access  Private
router.delete('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Tweet not found' });
    }
    console.log(req.user.id)
    const found = post.likes.findIndex(e => e.id === req.user.id);

    if (found === -1) {
      return res.status(404).json({ msg: 'Like not found' });
    }
  
    post.likes.splice(found, 1);

    await post.save();

    res.json({ msg: 'Like removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
})


module.exports = router;