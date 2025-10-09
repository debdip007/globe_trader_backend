const db = require("../models/index.js");
const helper = require("../helper/index.js");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CMS = db.cmspage;
const FAQ = db.faq;
require("dotenv").config();

exports.getUserList = async (req, res) => {
    try {        
        const { user_type, limit, offset } = req.body;

        page = limit == "" ? 0 : limit;
        pageSize = offset == "" || offset == undefined ? null : offset;    
        let whereObj = {};

        const queryOptions = {      
            order: [['id', 'DESC']],
        };
        
        whereObj.user_type = user_type;
        
        queryOptions.where = whereObj;
        
        if(pageSize != null) {
            queryOptions.limit = pageSize;
            queryOptions.offset = (page) * pageSize;
        }

        const userList = await User.findAll(
            queryOptions         
        );

        if(!userList || userList.length === 0) {
            res.status(500).send({ 
                success: 0, 
                message: "No user found."
            });            
        }else{
            // let obj = userList.toJSON();

            res.status(200).send({
                success: 1, 
                message: "User list found.",
                details: userList     
            });
        }
    } catch (err) { 
      console.log(err);   
      res.status(500).send({ 
        success: 0, 
        message: err.message 
      });
    }  
};

async function getFaqContent () {
  try {    
    const faq = await FAQ.findAll({
      where : {
        "status" : 1
      },
      order: [['sort_order', 'DESC']]
    });

    if(faq && faq.length > 0) {
        return faq;
    }    
  } catch (error) {
    console.error('Error getting FAQ details:', error);
  }    
}