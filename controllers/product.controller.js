const db = require("../models/index.js");
const helper = require("../helper/index.js");
const { Op } = require('sequelize');
const { saveBase64Image } = require('../helper/image.helper.js');
const Products = db.product;
const Categories = db.category;
const AdditionalImage = db.additionalImage;
const User = db.user;
require("dotenv").config();


exports.getProducts = async (req, res) => {
  try {
    let userType = page = pageSize = ""; 
    let returnObj = {};
    const productId = req.params.id;
    
    if(req.body !== undefined) {
        page = req.body.page == "" ? 0 : req.body.page;
        pageSize = req.body.page_size == "" ? 20 : req.body.page_size;
        userType = req.body.user_type == "" ? "SELLER" : req.body.user_type;    
        trending = req.body.trending == "" ? false : req.body.trending;    
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

    if(productId == null || productId == "") {
        const products = await Products.findAll(
            queryOptions         
        );

        if (!products || products.length === 0) {
            return res.status(401).send({ 
                success: 0,
                message: "No Products found." 
            });
        }else{ 
          
            const modifiedProductObj = await Promise.all(
              products.map(async (product) => {
                const obj = product.toJSON(); // <-- Important!

                const categoryName = await getCategoryName(obj.category);
                const subCategoryName = await getCategoryName(obj.sub_category);
                const seller = await getUserDetails(obj.seller_id);
                const additionalImage = await getAdditionalImage(obj.id);

                
                obj.country = JSON.parse(obj.country);
                obj.main_image = req.protocol  + '://' + req.get('host') + '/images/' +obj.main_image;
                obj.category_name = categoryName;
                obj.subCategory_name = subCategoryName;
                obj.additional_image = additionalImage;
                
                if(userType == "BUYER") {
                  obj.seller = seller;
                }

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
            return res.status(401).send({ 
                success: 0,
                message: "No Products found." 
            });
        }else{
            const productObj = products.toJSON();

            const categoryName = await getCategoryName(productObj.category);
            const subCategoryName = await getCategoryName(productObj.sub_category);
            const seller = await getUserDetails(productObj.seller_id);
            const additionalImage = await getAdditionalImage(productObj.id);
            

            productObj.country = JSON.parse(productObj.country);
            productObj.category = JSON.parse(productObj.category);
            productObj.sub_category = JSON.parse(productObj.sub_category);
            productObj.main_image = req.protocol  + '://' + req.get('host') + '/images/' +productObj.main_image;
            productObj.additional_image = [];
            
            productObj.category_name = categoryName;
            productObj.subCategory_name = subCategoryName;
            productObj.additional_image = additionalImage;
            
            if(userType == "BUYER") {
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
    const { product_name, sku, main_image, product_capacity, country, product_description, status, include, category, sub_category, product_quantity, product_unit, minimum_order_qty, minimum_order_qty_unit } = req.body;
    
    if(main_image != "") {
      savedPath = await saveBase64Image(main_image);
    }else{
      res.status(401).send({ success: 0, message: "Product Main Image is missing"});
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
        minimum_order_qty_unit
    });

    res.status(200).send({
      success: 1, 
      message: "Product created successfully!",         
    });
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

async function getUserDetails (userId) {
  try {    
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error('Error getting user details:', error);
  }    
}

async function getAdditionalImage (productId) {
  try {    
    const additional_image = await AdditionalImage.findAll({
      where : {
        "product_id" : productId
      }
    });
    return additional_image;
  } catch (error) {
    console.error('Error getting user details:', error);
  }    
}