const db = require("../models/index.js");
const helper = require("../helper/index.js");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CMS = db.cmspage;
const FAQ = db.faq;
require("dotenv").config();

exports.getPageDetails = async (req, res) => {
    try {
        const pageType = req.params.type;
    
        const page = await CMS.findOne({
            where: {
                slug: pageType,
                status: 1
            }
        });

        if(!page || page.length === 0) {
            res.status(500).send({ 
                success: 0, 
                message: "No page found with this slug "+pageType 
            });            
        }else{
            let pageObj = page.toJSON();

            if(pageType == "faq") {                
                pageObj.content = await getFaqContent();
            }
            res.status(200).send({
                success: 1, 
                message: "Page details found.",
                details: pageObj     
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