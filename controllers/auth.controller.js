const db = require("../models/index.js");
const User = db.user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { fullname, email, password, country, country_code, phone, status, user_type, is_verified, platform_type, profile_image } = req.body;
    
    const user = await User.create({
      fullname, 
      email,      
      password: bcrypt.hashSync(password, 8),
      country: JSON.stringify(country), 
      country_code: JSON.stringify(country_code), 
      phone,
      status: status,
      user_type,
      is_verified: 1,
      platform_type
    });
    res.status(201).send({ success: 1, message: "User registered successfully!" });
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
      return res.status(404).send({ message: "User Not found." });
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
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};