const db = require("../models/index.js");
const helper = require("../helper/index.js");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Appnotification = db.appnotification;
const { createNotification, prepareMessage } = require('../helper/notification.helper.js');

require("dotenv").config();

exports.getNotification = async (req, res) => {
    try {
        let userType = page = pageSize = user_id = "";

        if(req.body !== undefined) {
            page = req.body.page == "" || req.body.page_size == undefined ? 0 : req.body.page;
            pageSize = req.body.page_size == "" || req.body.page_size == undefined ? 20 : req.body.page_size;              
        }
        user_id = req.userId; 
        
        const queryOptions = {      
            order: [['id', 'DESC']],
        };

        queryOptions.where = {user_id : user_id};
        
        if(page >= 0 && pageSize > 0) {
            queryOptions.limit = pageSize;
            queryOptions.offset = (page) * pageSize;
        }        
  
        const notifications = await Appnotification.findAll(
            queryOptions         
        );

        if (!notifications || notifications.length === 0) {
            return res.status(500).send({ 
                success: 0,
                message: "No Notification found." 
            });
        }else{            
            const modifiedNotificationsObj = await Promise.all(
                notifications.map(async (notification) => {
                const obj = notification.toJSON(); // <-- Important!     
                return {
                    ...obj                                  
                };
                })
            );
            
            res.status(200).send({
                success: 1, 
                message: "Notification list found.",
                details: modifiedNotificationsObj     
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