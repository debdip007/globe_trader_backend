const db = require("../models/index.js");
const helper = require("../helper/index.js");
const { saveBase64Image } = require('../helper/image.helper.js');
const fs = require("fs");
const path = require("path");
const Products = db.product;
require("dotenv").config();

exports.getProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    if(req.body !== undefined) {
        const page = req.body.page == "" ? 1 : req.body.page;
        const pageSize = req.body.page_size == "" ? 20 : req.body.page_size;
        const sellerId = req.body.seller_id == "" ? 1 : req.body.seller_id;    
    }

    if(productId == null || productId == "") {
        const products = await Products.findAll({
            where: {
                status: 1,
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
            products.forEach(product => {
                product.country = JSON.parse(product.country);
                product.category = JSON.parse(product.category);
                product.sub_category = JSON.parse(product.sub_category);
                product.additional_image = [];
            }); 

            res.status(200).send({
                success: 1, 
                message: "Product list found.",
                products      
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
            products.country = JSON.parse(products.country);
            products.category = JSON.parse(products.category);
            products.sub_category = JSON.parse(products.sub_category);
            products.main_image = req.protocol  + '://' + req.get('host') + '/images/' +products.main_image;
            products.additional_image = [];

            res.status(200).send({
                success: 1, 
                message: "Product details found.",
                products      
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
    const device_type = req.headers["device_type"];

    let category_string = sub_category_string = country_string = "";     
    const { product_name, sku, main_image, product_capacity, country, product_description, status, include, seller_id, category, sub_category, product_quantity, product_unit, minimum_order_qty, minimum_order_qty_unit } = req.body;
    
    const savedPath = saveBase64Image(main_image);

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
        seller_id,
        device_type:device_type,
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
      console.error('Error inserting new user:', error);
    }
  }  
};

