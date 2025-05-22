const db = require("../models/index.js");
const helper = require("../helper/index.js");
const { saveBase64Image } = require('../helper/image.helper.js');
const fs = require("fs");
const path = require("path");
const Products = db.product;
require("dotenv").config();

exports.getProducts = async (req, res) => {
  try {
    let userType = page = pageSize = ""; 
    const productId = req.params.id;
    
    if(req.body !== undefined) {
        page = req.body.page == "" ? 1 : req.body.page;
        pageSize = req.body.page_size == "" ? 20 : req.body.page_size;
        userType = req.body.seller_id == "" ? 1 : req.body.user_type;    
    }
    sellerId = req.userId;

    if(productId == null || productId == "") {
        const products = await Products.findAll({
            where: {
                // status: 1,
                seller_id: sellerId 
            },
            limit: pageSize,
            offset: (page - 1) * pageSize          
        });

        if (!products || products.length === 0) {
            return res.status(401).send({ 
                success: 0,
                message: "No Products found." 
            });
        }else{  
            const modifiedProductObj = products.map(item => {
              const obj = item.toJSON(); // <-- Important!
              obj.country = JSON.parse(obj.country);
              obj.category = JSON.parse(obj.category);
              obj.sub_category = JSON.parse(obj.sub_category);
              obj.main_image = req.protocol  + '://' + req.get('host') + '/images/' +obj.main_image;
              obj.additional_image = [];
              return obj;
            }); 

            // console.log(modifiedProductObj);
            // return false;

            res.status(200).send({
                success: 1, 
                message: "Product list found.",
                products: modifiedProductObj     
            });
        }
    }else{
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
            productObj.country = JSON.parse(productObj.country);
            productObj.category = JSON.parse(productObj.category);
            productObj.sub_category = JSON.parse(productObj.sub_category);
            productObj.main_image = req.protocol  + '://' + req.get('host') + '/images/' +productObj.main_image;
            productObj.additional_image = [];

            res.status(200).send({
                success: 1, 
                message: "Product details found.",
                products: productObj      
            });
        }
    }
  } catch (err) {    
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
    console.log(req.body);
    return false;
    
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
    console.log(error);
    return false;
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(500).send({ success: 0, message: "Product with same SKU already exists." });
      console.error('Product with same SKU already exists.');
    } else {
      res.status(500).send({ success: 0, message: 'Error inserting new product:', error });
      console.error('Error inserting new product:', error);
    }
  }  
};

