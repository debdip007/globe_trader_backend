const db = require("../models/index.js");
const helper = require("../helper/index.js");
const { Op, where } = require('sequelize');
const { saveBase64Image, removeImage } = require('../helper/image.helper.js');
const { getCategoryName } = require('../helper/profile.helper.js');
const { query } = require("express-validator");
const Products = db.product;
const UserPreference = db.userPreference;
const Categories = db.category;
const AdditionalImage = db.additionalImage;
const User = db.user;
require("dotenv").config();


exports.getProducts = async (req, res) => {
  try {
    let userType = page = pageSize = param = "";
    let trending = false;  
    let returnObj = {};
    let preferredProductArr = [];
    const productId = req.params.id;
    
    if(req.body !== undefined) {
        page = req.body.page == "" || req.body.page == undefined ? 0 : req.body.page;
        pageSize = req.body.page_size == "" || req.body.page_size == undefined ? 20 : req.body.page_size;
        userType = req.body.user_type == "" || req.body.user_type == undefined ? "SELLER" : req.body.user_type;    
        trending = req.body.trending == "" || req.body.trending == undefined ? false : req.body.trending;    
        preferance = req.body.preferance == "" || req.body.preferance == undefined ? 0 : req.body.preferance;    
        param = req.body.param == "" || req.body.param == undefined ? "" : req.body.param;    
    }
    sellerId = req.userId;

    const queryOptions = {      
      order: [['id', 'DESC']],
    };

    if (userType == "SELLER") {
      queryOptions.where = {seller_id: sellerId};
    }else if(userType == "BUYER") {
      queryOptions.where = {status: 1};
    }

    if(trending == false) {
      queryOptions.limit = pageSize;
      queryOptions.offset = (page) * pageSize;
    }

    if(preferance == 1) {
      const preferredProduct = await UserPreference.findAll({
        attributes: ['product_id'],
        where : {user_type : __buyerType, user_id : sellerId, preferance : 1}
      });

      preferredProduct.map(async (item) => {
        preferredProductArr.push(item.toJSON().product_id);
      });

      queryOptions.where = {id : {[Op.in] : preferredProductArr}};
    }
    
    if(param != "") {
      queryOptions.where = {product_name : {[Op.like] : '%'+param+'%'}};
    }

    if(productId == null || productId == "") {
        const products = await Products.findAll(
            queryOptions         
        );

        if (!products || products.length === 0) {
            return res.status(500).send({ 
                success: 0,
                message: "No Products found." 
            });
        }else{           
            const modifiedProductObj = await Promise.all(
              products.map(async (product) => {
                const obj = product.toJSON(); // <-- Important!

                const categoryName = await getCategoryName(obj.category);
                const subCategoryName = await getCategoryName(obj.sub_category);
                const seller = await getUserDetails(obj.seller_id, req);
                const additionalImage = await getAdditionalImage(obj.id);

                obj.country = JSON.parse(obj.country);
                obj.category = JSON.parse(obj.category);
                obj.sub_category = JSON.parse(obj.sub_category);
                obj.main_image = req.protocol  + '://' + req.get('host') + '/images/' +obj.main_image;
                obj.category_name = categoryName;
                obj.subCategory_name = subCategoryName;
                obj.additional_image = additionalImage;
                
                // if(userType == "BUYER") {
                obj.seller = seller;
                // }

                return {
                  ...obj                                  
                };
              })
            );
            
            res.status(200).send({
                success: 1, 
                message: "Product list found.",
                products: modifiedProductObj     
            });
        }
    }else{
        // For Single product details
        const products = await Products.findOne({
            where: {
                id: productId
            }            
        });

        if (!products || products.length === 0) {
            return res.status(500).send({ 
                success: 0,
                message: "No Products found." 
            });
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
            
            if(seller.user_type == __buyerType) {
              productObj.seller = seller;
            }

            res.status(200).send({
                success: 1, 
                message: "Product details found.",
                products: productObj      
            });
        }
    }
  } catch (err) { 
    console.log(err);   
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    let sellerId = savedPath = "";
    sellerId = req.userId;

    const device_type = req.headers["device_type"];

    let category_string = sub_category_string = country_string = "";     
    const { product_id, product_name, sku, main_image, product_capacity, country, product_description, status, include, category, sub_category, product_quantity, product_unit, minimum_order_qty, minimum_order_qty_unit, product_capacity_unit } = req.body;
    
    if(main_image != "" && main_image != undefined) {
      savedPath = await saveBase64Image(main_image);
    }

    if(category != "") {
        category_string = JSON.stringify(category);
    }
    if(sub_category != "") {
        sub_category_string = JSON.stringify(sub_category);
    }    

    if(country != "") {
        country_string = JSON.stringify(country);
    } 
    
    if(product_id == "" || product_id == undefined ) {
      const productCreate = await Products.create({       
          product_name,
          sku,
          main_image:savedPath,
          product_capacity,
          country : country_string,
          product_description,
          category : category_string,
          sub_category: sub_category_string,
          status,
          include,
          seller_id: sellerId,
          device_type: device_type,
          product_quantity,
          product_unit,
          minimum_order_qty,
          minimum_order_qty_unit,
          product_capacity_unit
      });

      const updateProduct = await Products.findOne({
        where : {id : productCreate.id}
      });

      const updateProductObj = updateProduct.toJSON();

      const categoryName = await getCategoryName(updateProductObj.category);
      const subCategoryName = await getCategoryName(updateProductObj.sub_category);
      const seller = await getUserDetails(updateProductObj.seller_id, req);
      const additionalImage = await getAdditionalImage(updateProductObj.id);
      
      updateProductObj.country = JSON.parse(updateProductObj.country);
      updateProductObj.category = JSON.parse(updateProductObj.category);
      updateProductObj.sub_category = JSON.parse(updateProductObj.sub_category);
      updateProductObj.main_image = req.protocol  + '://' + req.get('host') + '/images/' +updateProductObj.main_image;
      updateProductObj.additional_image = [];

      updateProductObj.category_name = categoryName;
      updateProductObj.subCategory_name = subCategoryName;
      updateProductObj.additional_image = additionalImage;

      return res.status(200).send({
        success: 1, 
        message: "Product created successfully!",  
        details: updateProductObj       
      });
    }else{
      let updatedImage = "";
      const product = await Products.findOne({
        where : {id : product_id}
      });

      if(savedPath != "") {
        const productUpdate = await Products.update({
          main_image:savedPath
        },
        {
          where : {id: product_id}
        });
        
        const updateProduct = await Products.findOne({
          where : {id : product_id}
        });

        const updateProductObj = updateProduct.toJSON();

        const categoryName = await getCategoryName(updateProductObj.category);
        const subCategoryName = await getCategoryName(updateProductObj.sub_category);
        const seller = await getUserDetails(updateProductObj.seller_id, req);
        const additionalImage = await getAdditionalImage(updateProductObj.id);
        
        updateProductObj.country = JSON.parse(updateProductObj.country);
        updateProductObj.category = JSON.parse(updateProductObj.category);
        updateProductObj.sub_category = JSON.parse(updateProductObj.sub_category);
        updateProductObj.main_image = req.protocol  + '://' + req.get('host') + '/images/' +updateProductObj.main_image;
        updateProductObj.additional_image = [];

        updateProductObj.category_name = categoryName;
        updateProductObj.subCategory_name = subCategoryName;
        updateProductObj.additional_image = additionalImage;

        return res.status(200).send({
          success: 1, 
          message: "Product image Updated successfully!",         
          details: updateProductObj
        });
      }

      const productUpdate = await Products.update({       
          product_name,
          product_capacity,
          country : country_string,
          product_description,
          category : category_string,
          sub_category: sub_category_string,
          status,
          include,
          seller_id: sellerId,
          device_type: device_type,
          product_quantity,
          product_unit,
          minimum_order_qty,
          minimum_order_qty_unit,
          product_capacity_unit
      },
      {
        where : {id : product_id}
      });

      const updateProduct = await Products.findOne({
        where : {id : product_id}
      });

      const updateProductObj = updateProduct.toJSON();

      const categoryName = await getCategoryName(updateProductObj.category);
      const subCategoryName = await getCategoryName(updateProductObj.sub_category);
      const seller = await getUserDetails(updateProductObj.seller_id, req);
      const additionalImage = await getAdditionalImage(updateProductObj.id);
      
      updateProductObj.country = JSON.parse(updateProductObj.country);
      updateProductObj.category = JSON.parse(updateProductObj.category);
      updateProductObj.sub_category = JSON.parse(updateProductObj.sub_category);
      updateProductObj.main_image = req.protocol  + '://' + req.get('host') + '/images/' +updateProductObj.main_image;
      updateProductObj.additional_image = [];

      updateProductObj.category_name = categoryName;
      updateProductObj.subCategory_name = subCategoryName;
      updateProductObj.additional_image = additionalImage;

      return res.status(200).send({
        success: 1, 
        message: "Product Updated successfully!",         
        details: updateProductObj
      });
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(500).send({ success: 0, message: "Product with same SKU already exists." });
      console.error('Product with same SKU already exists.');
    } else {
      res.status(500).send({ success: 0, message: 'Error inserting new product:', error });
      console.error('Error inserting new product:', error);
    }
  }  
};

exports.addAdditionalImage = async (req, res) => {
  try {
    let sellerId = savedPath = "";
    sellerId = req.userId;

    const device_type = req.headers["device_type"];  
    const { product_id, status, sort_order, image } = req.body;

    const products = await Products.findOne({
      where : {id : product_id}
    });

    if(!products) {
      return res.status(401).send({ success: 0, message: "Product Not Found"});
    }
    
    if(image != "") {
      savedPath = await saveBase64Image(image);
    }else{
      return res.status(401).send({ success: 0, message: "Image is missing"});
    }
    
    const productAdditionalImageCreate = await AdditionalImage.create({       
        image : savedPath,
        product_id,
        status,
        sort_order
    });

    const updateProduct = await Products.findOne({
      where : {id : product_id}
    });

    const updateProductObj = updateProduct.toJSON();

    const categoryName = await getCategoryName(updateProductObj.category);
    const subCategoryName = await getCategoryName(updateProductObj.sub_category);
    const seller = await getUserDetails(updateProductObj.seller_id, req);
    const additionalImage = await getAdditionalImage(updateProductObj.id);
    
    updateProductObj.country = JSON.parse(updateProductObj.country);
    updateProductObj.category = JSON.parse(updateProductObj.category);
    updateProductObj.sub_category = JSON.parse(updateProductObj.sub_category);
    updateProductObj.main_image = req.protocol  + '://' + req.get('host') + '/images/' +updateProductObj.main_image;
    updateProductObj.additional_image = [];

    updateProductObj.category_name = categoryName;
    updateProductObj.subCategory_name = subCategoryName;
    updateProductObj.additional_image = additionalImage;

    res.status(200).send({
      success: 1, 
      message: "Product additional image added successfully!",
      details: updateProductObj         
    });
  } catch (error) {
    res.status(500).send({ success: 0, message: 'Error inserting new additional image:', error });
    console.error('Error inserting new additional image:', error);
  }  
};


exports.removeAdditionalImage = async (req, res) => {
  try {
    let sellerId = savedPath = "";
    sellerId = req.userId;

    const device_type = req.headers["device_type"];  
    const id = req.params.id;

    const additional_image = await AdditionalImage.findByPk(id);
    
    if(additional_image) {
      let product_id = additional_image.product_id;

      await removeImage(additional_image.image);
      
      const deletedAdditionalImage = await AdditionalImage.destroy({
        where: { id: id }
      });

      const updateProduct = await Products.findOne({
        where : {id : product_id}
      });

      const updateProductObj = updateProduct.toJSON();

      const categoryName = await getCategoryName(updateProductObj.category);
      const subCategoryName = await getCategoryName(updateProductObj.sub_category);
      const seller = await getUserDetails(updateProductObj.seller_id, req);
      const additionalImage = await getAdditionalImage(updateProductObj.id);
      
      updateProductObj.country = JSON.parse(updateProductObj.country);
      updateProductObj.category = JSON.parse(updateProductObj.category);
      updateProductObj.sub_category = JSON.parse(updateProductObj.sub_category);
      updateProductObj.main_image = req.protocol  + '://' + req.get('host') + '/images/' +updateProductObj.main_image;
      updateProductObj.additional_image = [];

      updateProductObj.category_name = categoryName;
      updateProductObj.subCategory_name = subCategoryName;
      updateProductObj.additional_image = additionalImage;

      res.status(200).send({
        success: 1, 
        message: "Product additional image deleted successfully!",   
        details: updateProductObj      
      });
      
    }else{
      res.status(401).send({ success: 0, message: "Image is missing"});
    }
  } catch (error) {
    res.status(500).send({ success: 0, message: 'Error deleting additional image:', error });
    console.error('Error deleting additional image:', error);
  }  
};

/*async function getCategoryName (categoryIdArray) {
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
  
}*/

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