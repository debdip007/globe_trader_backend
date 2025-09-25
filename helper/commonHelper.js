const db = require("../models/index.js");
const { getCategoryName } = require('../helper/profile.helper.js');
const Products = db.product;
const AdditionalImage = db.additionalImage;
const User = db.user;

const generateEmailOTP = () => {
  // return 1234;
  return Math.floor(Math.random() * 9000) + 1000;
};

async function productDetailsByID(productId, req) {
  const products = await Products.findOne({
      where: {
          id: productId
      }            
  });

  if (!products || products.length === 0) {
      return false;
  }else{
      const productObj = products.toJSON();

      const categoryName = await getCategoryName(productObj.category);
      const subCategoryName = await getCategoryName(productObj.sub_category);
      const seller = await getUserDetails(productObj.seller_id, req);
      const additionalImage = await getAdditionalImage(productObj.id);
      
      productObj.country = JSON.parse(productObj.country);
      productObj.category = JSON.parse(productObj.category);
      productObj.sub_category = JSON.parse(productObj.sub_category);
      productObj.main_image = req.protocol  + '://' + req.get('host') + '/images/' +productObj.main_image;
      productObj.additional_image = [];
      
      productObj.category_name = categoryName;
      productObj.subCategory_name = subCategoryName;
      productObj.additional_image = additionalImage;
      
      // if(seller.user_type == __buyerType) {
        productObj.seller = seller;
      // }
      
      return productObj;
  }
} 

async function getUserDetails (userId, req = null) {
  try {    
    const user = await User.findByPk(userId);
    const obj = user.toJSON(); 
    if(obj.profile_image != null && obj.profile_image != undefined) {
      obj.profile_image = req.protocol  + '://' + req.get('host') + '/images/profile/' +obj.profile_image;
    }
    
    return obj;
  } catch (error) {
    console.error('Error getting user details:', error);
  }    
}

async function getAdditionalImage (productId) {
  try {    
    const additional_image = await AdditionalImage.findAll({
      where : {
        "product_id" : productId,
        "status" : 1
      }
    });
    return additional_image;
  } catch (error) {
    console.error('Error getting additional image details:', error);
  }    
}

module.exports = {
  generateEmailOTP,
  productDetailsByID,
  getUserDetails
};