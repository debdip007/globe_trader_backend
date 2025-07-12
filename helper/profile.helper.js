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

            if(profileDetails != null && profileDetails.business_country_names != null && profileDetails.business_country_names != undefined) {
                profileDetails.business_country_names = JSON.parse(profileDetails.business_country_names);
            }
            break;
        case "BUYER":
            profileDetails = await BuyerProfile.findOne({
                where: {
                    buyer_id : userId
                }
            });

            if(profileDetails != null && profileDetails.interest_category != null && profileDetails.interest_category != undefined) {
                // profileDetails.interest_category = await getCategoryName(profileDetails.interest_category);
                profileDetails.interest_category = JSON.parse(profileDetails.interest_category);
            }

            if(profileDetails != null && profileDetails.interest_sub_category != null && profileDetails.interest_sub_category != undefined) {
                // profileDetails.interest_sub_category = await getCategoryName(profileDetails.interest_sub_category);
                profileDetails.interest_sub_category = JSON.parse(profileDetails.interest_sub_category);
            } 

            if(profileDetails != null && profileDetails.business_country_names != null && profileDetails.business_country_names != undefined) {
                profileDetails.business_country_names = JSON.parse(profileDetails.business_country_names);
            }
            // Add additional category key
            const obj = profileDetails.toJSON();
            obj.interest_category_details = await getCategoryDetails(profileDetails.interest_category);
            obj.interest_sub_category_details = await getCategoryDetails(profileDetails.interest_sub_category);

            return obj;
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


async function getCategoryDetails (categoryIdArray) {
  try {
    let modifiedCategoryObj = [];
    const category = await Categories.findAll({
        where: {
          id: {
            [Op.in]: categoryIdArray
          }    
        }
    });
    // category.forEach((item) => {
    //   modifiedCategoryObj.push(item.name);
    // });
    return category;
  } catch (error) {
    console.error('Error getting catagory name:', error);
  }  
  
}


module.exports = { getProfileDetails, getCategoryName, getCategoryDetails };