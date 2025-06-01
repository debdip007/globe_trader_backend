const db = require("../models/index.js");
const { Op } = require('sequelize');
const SellerProfile = db.sellerprofile;
const BuyerProfile = db.buyerProfile;
const Categories = db.category;


async function getProfileDetails(userId, userType) {
    let profileDetails;

    switch (userType) {
        case "SELLER":
            profileDetails = await SellerProfile.findOne({
                where: {
                    seller_id : userId
                }
            });
            break;
        case "BUYER":
            profileDetails = await BuyerProfile.findOne({
                where: {
                    buyer_id : userId
                }
            });
            profileDetails.interest_category = await getCategoryName(profileDetails.interest_category);
            profileDetails.interest_sub_category = await getCategoryName(profileDetails.interest_sub_category);
            break;
        default:
            break;
    }
    
    return profileDetails;
}

async function getCategoryName (categoryIdArray) {
  try {
    let modifiedCategoryObj = [];
    const category = await Categories.findAll({
        attributes: ['name'],
        where: {
          id: {
            [Op.in]: JSON.parse(categoryIdArray)
          }    
        }
    });
    category.forEach((item) => {
      modifiedCategoryObj.push(item.name);
    });
    return modifiedCategoryObj;
  } catch (error) {
    console.error('Error getting catagory name:', error);
  }  
  
}

module.exports = { getProfileDetails, getCategoryName };