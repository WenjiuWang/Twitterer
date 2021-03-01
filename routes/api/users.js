const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const { check, validationResult} = require('express-validator/check')
const bcrypt = require('bcryptjs')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')

const config = require('config')

// @route   Post api/users/register
// @desc    Register user
// @access  Public
router.post('/register', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'PLease enter a valid email').isEmail(),

    check('password', 'please enter a password with 8 or more char')
    .isLength({min: 8})
], async (req, res) => {

    console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }

    const {name, email, password} = req.body

    try {

        //see if user exists
        let user = await User.findOne({email});

        if (user) {
            res.status(400).json( { errors: [{msg: 'user existed'}]});
        }

        //get user gravar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name, 
            email,
            avatar,
            password
        })

        //encrypt password

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save()

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