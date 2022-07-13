const express = require("express");
const gravatar = require('gravatar')
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../../middleware/auth')

//@route GET api/auth
//@desc Test Route
//@access Public
router.get('/', auth, async(req, res)=>{
  try {
    const user  = await User.findById(req.user.id).select('-password')
    res.json(user)

  } catch (error) {
    console.error(error.message)
    res.status(500).json({msg: 'Server error'})
  } 
})

//@route POST api/auth
//@desc Login User
//@access Public

router.post(
  "/",
  [
   
    check("Email is required"),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    console.log("body",req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const { email, password} = req.body;

    try {
    
    //See if user exists
    let user = await User.findOne({email})
    
    if(!user){
       return res.status(500).json({errors: [{msg:'Invalid credentials' }]})
    } 

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(500).json({errors: [{msg:'Invalid credentials' }]})
    }
  
    const payload = {
        user:{
            id: user.id
        }
    }
    
    //Return jsonwebtoken
    
        jwt.sign(payload, config.get('jwtSecret'), {expiresIn:360000}, (err, token)=>{
            if(err) throw err;
           
             return res.json({token})
          })
    

    

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
    



    // res.send("Users Route");
  }
);

module.exports = router;
