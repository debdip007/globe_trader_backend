const db = require("../models/index.js");
const Appnotification = db.appnotification;
const User = db.user;
const moment = require('moment-timezone');

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
    let message = companyName = "";

    const user = await User.findOne({
        where: {
            id: userId
        }
    });
    let fullName = user.first_name+' '+user.last_name;

    if(user.user_type == "SELLER") {
        profileDetails = await SellerProfile.findOne({
            where: {
                seller_id : userId
            }
        });

        companyName = profileDetails.company_name;
    }else if(user.user_type == "BUYER") {
        profileDetails = await BuyerProfile.findOne({
            where: {
                seller_id : userId
            }
        });

        companyName = profileDetails.company_name;
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
    message = message.replace("{user_name}", companyName);

    return message;
}

module.exports = {
  createNotification,
  prepareMessage
};