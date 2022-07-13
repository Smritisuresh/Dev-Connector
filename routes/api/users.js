const express = require("express");
const gravatar = require('gravatar')
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
//@route POST api/users
//@desc Register User
//@access Public

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("Email is required"),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a valid password of length 6").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    console.log("body",req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password} = req.body;

    try {
    
    //See if user exists
    let user = await User.findOne({email})
    
    if(user){
       return res.status(500).json({errors: [{msg:'User already exists' }]})
    } 

    //Get users gravatar
    const avatar  = gravatar.url(email, {
        s:'200', r:'pg', d:'mm'
    })

    user = new User({
        name, email, avatar, password
    })

    
    
    //Encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();
    const payload = {
        user:{
            id: user.id
        }
    }

    jwt.sign(payload, config.get('jwtSecret'), {expiresIn:360000}, (err, token)=>{
      if(err) throw err;
     
       return res.json({token})
    })
    //Return jsonwebtoken

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
    



    // res.send("Users Route");
  }
);

module.exports = router;
