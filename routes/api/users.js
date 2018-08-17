const express   = require('express');
const router    = express.Router();
const User      = require('../../models/User');
const gravatar  = require('gravatar');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const passport  = require('passport');
const keys      = require('../../config/keys');
//Nodejs Grabatar Node.js:
//A library to generate Gravatar URLs in Node.js Based on gravatar specs

//@route    GET api/posts/test
//@desc     Test users route
//@access   Public
router.get('/test', (req, res) => {
  res.json({msg: 'Users Works!'})
})


//@route    GET api/posts/register
//@desc     Register User
//@access   Public
router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if(user){
        return res.status(400).json({email: 'Email already exists'})
      } else {
        //note avatar is not required as its only being included programmatically
        //if required, might give an error
        const avatar = gravatar.url(req.body.email, {
          s: '200',//size
          r: 'pg', //rating
          d: 'mm' // default
        })
        //mongose New user: use keyword new then the Model name
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then( user => res.json(user))
              .catch(err => console.log(err))
          })
        })
      }
    })
})


//@route    GET api/posts/login
//@desc     Login User / Return JWT Token
//@access   Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find the user
  User.findOne({email})
    .then(user => {
      //check for user
      if(!user){
        return res.status(404).json({email: 'User Not found'})
      }

      //Check Password
      //With this step: the logic is there: but we are not sending the token back yet
      bcrypt.compare(password, user.password)
      //isMatch: this is a boolean that results in either true or false
        .then(isMatch => {
          console.log(isMatch)
          if(isMatch){
            //Create and Send the token here
            //create payload (object literal) info:
            const payload = { id: user.id, name: user.name, avatar: user.avatar}
            //Sign Token:
            jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              }) //at this point, create the password strategy
            });
          } else {
            return res.status(400).json({password: 'Password incorrect'});
          }
        })
    })
})


//@route    GET api/posts/current
//@desc     Return Current user
//@access   Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  //if authentication with passport(passport.js) goes well, user will be in the req  
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
})


module.exports = router;