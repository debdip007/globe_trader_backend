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
    const page = req.body.page == "" ? 1 : req.body.page;
    const pageSize = req.body.page_size == "" ? 20 : req.body.page_size;
    const sellerId = req.body.seller_id == "" ? 20 : req.body.seller_id;

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
    let category_string = sub_category_string = country_string = "";     
    const { product_name, sku, main_image, product_unit, minimum_order_qty, product_capacity, country, product_description, status, include, seller_id, device_type, category, sub_category } = req.body;
    
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
        product_unit,
        minimum_order_qty,
        product_capacity,
        country : country_string,
        product_description,
        category : category_string,
        sub_category: sub_category_string,
        status,
        include,
        seller_id,
        device_type
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


const uploadBase64Image = (imageBase64) => {

  // Validate the base64 string
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'Invalid image data' });
  }

  // Extract the image format and base64 data
  const matches = imageBase64.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return res.status(400).json({ error: 'Invalid base64 format' });
  }

  const imageType = matches[1];
  const imageData = matches[2];
  const buffer = Buffer.from(imageData, 'base64');

  // Generate a unique filename
  const filename = `image_${Date.now()}.${imageType}`;
  const filePath = path.join(__basedir, 'media/uploads', filename);

  // Ensure the uploads directory exists  
  fs.mkdirSync(path.join(__basedir, 'media/uploads'), { recursive: true });

  // Save the image file
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error('Error saving image:', err);
      return false;
      // return res.status(500).json({ error: 'Failed to save image' });
    }
    console.log("From image upload function "+filePath);
    return filePath;
    // res.status(200).json({ message: 'Image uploaded successfully', filename });
  });
};
