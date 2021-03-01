const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Message = require('../../models/Message');


// @route    POST api/message/:id
// @desc     Create a new message to user with id
// @access   Private
router.post('/:id', auth,
    check('text', 'Message cannot be empty').notEmpty(),
    check('text', 'Message exceed 500 characters').isLength({max: 500}),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const to = await User.findById(req.params.id).select('-password');
        if (!to || to.id.toString() === req.user.id.toString()) {
            return res.status(404).json({ msg: 'Invalid recipient' });
        }
  
        const newMessage = new Message ({
          fromUser: req.user.id,
          toUser: req.params.id,
          content: req.body.text,
        });
  
        const message = await newMessage.save();
        
        res.json(message);

        req.io.sockets.emit('messages', message);

      } catch (err) {
        res.status(500).send('Server Error');
      }
    }
);

// @route    GET api/posts/:id
// @desc     Get message associate with user id
// @access   Private
router.get('/:id', auth, async (req, res) => {
    try {
      const messages = await Message.find({
          $or: [{fromUser: req.user.id, toUser: req.params.id},
            {toUser: req.user.id, fromUser: req.params.id}]
      }).sort({ date: -1 });
      if (!messages || messages.length === 0) {
        return res.status(404).json({ msg: 'No message exists' });
      }
  
      res.json(messages);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;