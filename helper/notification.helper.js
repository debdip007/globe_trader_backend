const db = require("../models/index.js");
const Appnotification = db.appnotification;
const User = db.User;
const moment = require('moment-timezone');
const { getProfileDetails } = require('../helper/profile.helper.js');

async function createNotification (userId, title, message, messageType, req = null) {
  try { 
    const now = new Date();

    // Format: YY-MM-DD HH:mm:ss
    let sent_date = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    
    const notificationCreate = await Appnotification.create({       
        user_id : userId,
        title: title,
        message: message,
        type: messageType,
        is_read: 0,
        sent_at: sent_date
    });
    return true;
  } catch (error) {
    console.error('Error getting user details:', error);
  }    
}

async function prepareMessage(userId, messageType) {
    let message = requestName ="";

    const user = await User.findOne({
        where: {
            id: userId
        }
    });
    let fullName = user.first_name+' '+user.last_name;

    profile_details = await getProfileDetails(user.id, user.user_type);
    
    if(profile_details != null) {
        requestName = profile_details.company_name;
    }else{
        requestName = fullName;
    }
    
    switch (messageType) {
        case "seller_request_receive":
            message = "You have a new contact request from {user_name}";
            break;
        case "seller_request_approve":
            message = "Requested {user_name} approve your request.";
            break;
        case "buyer_request_receive":
            message = "{user_name} Requested for your contact details";
            break;
        case "buyer_request_approve":
            message = "Requested {user_name} approve your request.";
            break;
        default:
            break;
    }
    message = message.replace("{user_name}", requestName);

    return message;
}

module.exports = {
  createNotification,
  prepareMessage
};