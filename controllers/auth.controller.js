const db = require("../models/index.js");
const helper = require("../helper/index.js");
const User = db.user;
const RegisterOTP = db.registerotp;
const BuyerInterest = db.buyerInterest;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { getProfileDetails } = require('../helper/profile.helper.js');
const { Op, where } = require('sequelize');
const { EmailHelper } = require('../helper/email.helper.js');
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

exports.generateOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = helper.commonHelpers.generateEmailOTP();
    const timeDiff = 90;
    const now = new Date();
    now.setSeconds(now.getMinutes() + timeDiff);
    const timestamp = now.getTime();

    const otpTemplatePath = path.join(__dirname, "../email-template/otp-template.html");
    const otpTemplateSource = fs.readFileSync(otpTemplatePath, "utf8");
    const template = handlebars.compile(otpTemplateSource);

    const htmlContent = template({        
      otp: otp,
      expiry_minutes: timeDiff,
      company_name: "Globe Trader",
      support_email: "info@globetrader.com",
      logo_url: "http://65.109.225.193:4200/assets/brand/GlobeTrader_Logo_White.png"
    });

    const checkUser = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    console.log(checkUser);

    if(checkUser) {
      return res.status(401).send({ success: 0, message: "User already exists with the email "+req.body.email });
    }

    const checkotp = await RegisterOTP.findOne({ where: { email: req.body.email } });

    if (checkotp) {
      // OTP exists, proceed to update
      
      const diffInMilliseconds = now.getTime() - checkotp.timestamp;
      const diffInSeconds = diffInMilliseconds / (1000);
      console.log(diffInSeconds);
      if(diffInSeconds < timeDiff) {
        return res.status(401).send({ success: 0, message: "OTP already sent. You can resend OTP after "+ (timeDiff - diffInSeconds).toFixed(2) +" seconds."}); 
      }
      
      const [updateotp] = await RegisterOTP.update({
        otp,
        timestamp : timestamp
      }, { where: { email: req.body.email } });   

      const sendOtpEmail = await EmailHelper.sendMail(email, 'Hello User, your OTP is '+otp+'. It will expire in '+timeDiff+' minutes.', htmlContent);
      
      if(sendOtpEmail) {
        return res.status(200).send({ success: 1, message: "An OTP has been successfully sent to your email." });
      }else{
        return res.status(500).send({success: 0, message: 'Error Sending the OTP email.'});
      }
      // return res.status(200).send({ success: 1, message: "An OTP has been successfully sent to your email." });
    } else {
      // OTP does not exist
      const generateotp = await RegisterOTP.create({       
        email,
        attempt : 1,
        status : 1,
        otp,
        timestamp : timestamp
      });
      
      const sendOtpEmail = await EmailHelper.sendMail(email, 'Hello User, your OTP is '+otp+'. It will expire in '+timeDiff+' minutes.', htmlContent);

      if(sendOtpEmail) {
        return res.status(200).send({ success: 1, message: "An OTP has been successfully sent to your email." });
      }else{
        return res.status(500).send({success: 0, message: 'Error Sending the OTP email.'});
      }      
    }    
  } catch (error) {
    res.status(500).send({ success: 0, message: 'Error creating new OTP:', error });
    console.error('Error inserting new user:', error);    
  }
};

exports.register = async (req, res) => {
  try {
    const { fullname, email, password, country, country_code, phone, status, user_type, is_verified, platform_type, profile_image, otp, attempt, first_name, last_name, user_role } = req.body;
    
    const checkotp = await RegisterOTP.findOne({ where: { email: email, otp: otp } });

    const checkUser = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    
    if(checkUser) {
      return res.status(401).send({ success: 0, message: "User already exists with the email "+req.body.email });
    }  

    let statusCode = status == "" || status == null ? 1 : status;

    if(checkotp) {
      const user = await User.create({
        fullname, 
        email,      
        password: bcrypt.hashSync(password, 8),
        country: country, //JSON.stringify(country) 
        country_code: country_code, //JSON.stringify(country_code), 
        phone,
        status: statusCode,
        user_type,
        is_verified: 1,
        platform_type,
        first_name,
        last_name,
        user_role 
      });

      res.status(200).send({ success: 1, message: "User registered successfully!" });
    }else{
      const [updateotp] = await RegisterOTP.update({
        attempt
      }, { where: { email: req.body.email } });   

      res.status(401).send({ success: 0, message: "OTP not matched, please try again." });
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
    let profile_details = {};

    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(401).send({ 
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

    profile_details = await getProfileDetails(user.id, user.user_type);

    res.status(200).send({
      success: 1, 
      message: "User login successfully!",
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
        profile_image: user.profile_image != null ? req.protocol  + '://' + req.get('host') + '/images/profile/' +user.profile_image : "",
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        accessToken: token,
        first_name : user.first_name,
        last_name : user.last_name,
        user_role : user.user_role, 
        profile_details : profile_details
      }      
    });
  } catch (err) {
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }  
};

exports.refreshToken = async (req, res) => {
  try {
    let profile_details = {};

    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(401).send({ 
        success: 0,
        message: "User Not found." 
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600 // 1 hours
    });

    profile_details = await getProfileDetails(user.id, user.user_type);

    res.status(200).send({
      success: 1, 
      message: "Token updated successfully!",
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
        profile_image: user.profile_image != null ? req.protocol  + '://' + req.get('host') + '/images/profile/' +user.profile_image : "",
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        accessToken: token,
        first_name : user.first_name,
        last_name : user.last_name,
        user_role : user.user_role,
        profile_details : profile_details
      }      
    });
  } catch (err) {
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }
};

exports.getBuyerlist = async (req, res) => {
  try {    
    let sellerId = request_sent = request_received = user_type = userId = "";
    let buyerInterestArr = [];
    let whereObj = {};

    if(req.body !== undefined) {
        page = req.body.page == "" ? 0 : req.body.page;
        pageSize = req.body.page_size == "" || req.body.page_size == undefined ? null : req.body.page_size;    
        sellerId = req.body.seller_id == "" || req.body.seller_id == undefined ? null : req.body.seller_id;    
        request_sent = req.body.request_sent == "" || req.body.request_sent == undefined ? null : req.body.request_sent;    
        request_received = req.body.request_received == "" || req.body.request_received == undefined ? null : req.body.request_received;    
        requested = req.body.requested == "" || req.body.requested == undefined ? null : req.body.requested;    
        user_type = req.body.user_type == "" || req.body.user_type == undefined ? null : req.body.user_type;    
    }
    userId = req.userId;

    const queryOptions = {      
      order: [['id', 'DESC']],
    };

    if(sellerId != "") {
      user_type = __sellerType;
    }

    if(request_sent == true || requested == 1) {
      if(user_type == __buyerType) {
        const buyerInterest = await BuyerInterest.findAll({
          attributes: ['seller_id'],
          where : {user_type : __buyerType, buyer_id : userId}
        });
  
        buyerInterest.map(async (item) => {
          buyerInterestArr.push(item.toJSON().seller_id);
        });
        whereObj.id = {[Op.in] : buyerInterestArr};
      }else if(user_type == __sellerType) {
        const buyerInterest = await BuyerInterest.findAll({
          attributes: ['buyer_id'],
          where : {user_type : __sellerType, seller_id : userId}
        });
  
        buyerInterest.map(async (item) => {
          buyerInterestArr.push(item.toJSON().buyer_id);
        });
        whereObj.id = {[Op.in] : buyerInterestArr};
      }
    }else if(request_received == true) {
      if(user_type == __buyerType) {
        const buyerInterest = await BuyerInterest.findAll({
          attributes: ['seller_id'],
          where : {user_type : __sellerType, buyer_id : userId}
        });
  
        buyerInterest.map(async (item) => {
          buyerInterestArr.push(item.toJSON().seller_id);
        });
        whereObj.id = {[Op.in] : buyerInterestArr};
      }else if(user_type == __sellerType) {
        const buyerInterest = await BuyerInterest.findAll({
          attributes: ['buyer_id'],
          where : {user_type : __buyerType, seller_id : userId}
        });
  
        buyerInterest.map(async (item) => {
          buyerInterestArr.push(item.toJSON().buyer_id);
        });
        whereObj.id = {[Op.in] : buyerInterestArr};
      }
    }

    whereObj.status = 1
    if(sellerId != "") {
      whereObj.user_type = __buyerType;
    }
    queryOptions.where = whereObj;
    
    if(pageSize != null) {
      queryOptions.limit = pageSize;
      queryOptions.offset = (page) * pageSize;
    }

    const buyerList = await User.findAll(
        queryOptions         
    );

    const modifiedBuyerObj = await Promise.all(
      buyerList.map(async (buyer) => {
        const obj = buyer.toJSON(); // <-- Important!

        const profile_details = await getProfileDetails(obj.id, obj.user_type);

        obj.profile_image = obj.profile_image != null ? req.protocol  + '://' + req.get('host') + '/images/profile/' +obj.profile_image : "",
        obj.profile_details = profile_details;

        return {
          ...obj                                  
        };
      })
    );

    return res.status(200).send({ 
      success: 1,
      message: "Buyer list found.",
      details : modifiedBuyerObj
    });
  } catch (err) {
    console.log(err);
    return false;
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }
};

exports.sendTestEmail = async (req, res) => {
  try {
    const email = 'debdip666@gmail.com';
    const html = `<h1>Welcome, Test!</h1><p>Thanks for joining 🚀</p>`;

    const result = await EmailHelper.sendMail(email, 'Welcome to MyApp!', html);

    if (result.success) {
      res.json({ success: true, message: 'Welcome email sent.' });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (err) { 
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }
};