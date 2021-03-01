const { ESRCH } = require('constants');
const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { check, validationResult} = require('express-validator/check')
const config = require('config')


// @route   Post api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error')
    }
});


// @route    POST api/auth
// @desc     Login user and get token
// @access   Public
router.post('/login', [
    check('email', 'PLease enter a valid email').isEmail(),
    check('password', 'Please enter a password ').not().isEmpty()
], async (req, res) => {

    console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }

    const {email, password} = req.body

    try {

        //see if user exists
        let user = await User.findOne({email});

        if (!user) {
            res.status(400).json( { errors: [{msg: 'User does not exist'}]});
        }
        
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            res.status(400).json( { errors: [{msg: 'Wrong password'}]});
        }

        //return json web token
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 36000
        }, (err, token) => {
            if (err) throw err;
            res.json({token});
        });


    } catch(err) {
        console.error(err)
        req.status(500).send('server error')

    }

});

module.exports = router;