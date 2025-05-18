const db = require("../models/index.js");
const helper = require("../helper/index.js");
const User = db.user;
const RegisterOTP = db.registerotp;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.generateOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = helper.commonHelpers.generateEmailOTP();
    const timeDiff = 5;
    const now = new Date();
    now.setMinutes(now.getMinutes() + timeDiff);
    const timestamp = now.getTime();

    const checkUser = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    console.log(checkUser);

    if(checkUser) {
      return res.status(201).send({ success: 0, message: "User already exists with the email "+req.body.email });
    }

    const checkotp = await RegisterOTP.findOne({ where: { email: req.body.email } });

    if (checkotp) {
      // OTP exists, proceed to update
      
      const diffInMilliseconds = now.getTime() - checkotp.timestamp;
      const diffInMinutes = diffInMilliseconds / (1000 * 60);
      console.log(diffInMinutes);
      if(diffInMinutes < timeDiff) {
        return res.status(201).send({ success: 0, message: "OPT already sent. You can resend OTP after "+ (timeDiff - diffInMinutes).toFixed(2) +" minutes."}); 
      }
      
      const [updateotp] = await RegisterOTP.update({
        otp,
        timestamp : timestamp
      }, { where: { email: req.body.email } });   
      
      return res.status(201).send({ success: 1, message: "OTP sent again to your email "+req.body.email });
    } else {
      // OTP does not exist
      const generateotp = await RegisterOTP.create({       
        email,
        attempt : 1,
        status : 1,
        otp,
        timestamp : timestamp
      });

      return res.status(201).send({ success: 1, message: "OTP sent to your email "+req.body.email });
    }
    
  } catch (error) {
    res.status(500).send({ success: 0, message: 'Error creating new OTP:', error });
    console.error('Error inserting new user:', error);    
  }
};

exports.register = async (req, res) => {
  try {
    const { fullname, email, password, country, country_code, phone, status, user_type, is_verified, platform_type, profile_image, otp, attempt } = req.body;
    
    const checkotp = await RegisterOTP.findOne({ where: { email: email, otp: otp } });

    const checkUser = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    
    if(checkUser) {
      return res.status(201).send({ success: 0, message: "User already exists with the email "+req.body.email });
    }  

    if(checkotp) {
      const user = await User.create({
        fullname, 
        email,      
        password: bcrypt.hashSync(password, 8),
        country: country, //JSON.stringify(country) 
        country_code: country_code, //JSON.stringify(country_code), 
        phone,
        status: status,
        user_type,
        is_verified: 1,
        platform_type
      });

      res.status(201).send({ success: 1, message: "User registered successfully!" });
    }else{
      const [updateotp] = await RegisterOTP.update({
        attempt
      }, { where: { email: req.body.email } });   

      res.status(201).send({ success: 0, message: "OTP not matched, please try again." });
    }
    
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(500).send({ success: 0, message: "Email already exists." });
      console.error('Email already exists.');
    } else {
      res.status(500).send({ success: 0, message: 'Error inserting new user:', error });
      console.error('Error inserting new user:', error);
    }    
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({ 
        success: 0,
        message: "User Not found." 
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        success: 0,
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600 // 1 hours
    });

    res.status(200).send({
      success: 1, 
      message: "User login  successfully!",
      details : {
        id: user.id,
        fullname: user.fullname,
        email: user.email,      
        phone: user.phone,
        status: user.status,
        user_type: user.user_type,
        is_verified: user.is_verified,
        country: user.country,
        country_code: user.country_code,
        platform_type: user.platform_type,
        profile_image: user.profile_image,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        accessToken: token
      }      
    });
  } catch (err) {
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }  
};

const checkExistingUser = (email) => {
  try {
    const user = User.findOne({
      where: {
        email: email
      }
    });
    console.log(user);
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }  
};