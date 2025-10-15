const db = require("../models/index.js");
const helper = require("../helper/index.js");
const User = db.User;
const Role = db.Role;
const Permission = db.Permission;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const product = require("../models/product.js");
const Products = db.product;
require("dotenv").config();

exports.getUserList = async (req, res) => {
    try {        
        const { user_type, limit, offset } = req.body;

        page = limit == "" ? 0 : limit;
        pageSize = offset == "" || offset == undefined ? null : offset;    
        let whereObj = {};

        const queryOptions = {      
            order: [['id', 'DESC']],
        };
        
        whereObj.user_type = user_type;
        
        queryOptions.where = whereObj;
        
        if(pageSize != null) {
            queryOptions.limit = pageSize;
            queryOptions.offset = (page) * pageSize;
        }

        const userList = await User.findAll(
            queryOptions         
        );

        if(!userList || userList.length === 0) {
            res.status(500).send({ 
                success: 0, 
                message: "No user found."
            });            
        }else{
            // let obj = userList.toJSON();

            res.status(200).send({
                success: 1, 
                message: "User list found.",
                details: userList     
            });
        }
    } catch (err) { 
      console.log(err);   
      res.status(500).send({ 
        success: 0, 
        message: err.message 
      });
    }  
};

exports.getProductList = async (req, res) => {
    try {        
        const { status, limit, offset } = req.body;

        page = limit == "" ? 0 : limit;
        pageSize = offset == "" || offset == undefined ? null : offset;    
        let whereObj = {};

        const queryOptions = {      
            order: [['id', 'DESC']],
        };

        queryOptions.where = { status : status};

        const products = await Products.findAll(
            queryOptions         
        );

        if(!products || products.length === 0) {
            res.status(500).send({ 
                success: 0, 
                message: "No product found."
            });            
        }else{
            // let obj = userList.toJSON();

            res.status(200).send({
                success: 1, 
                message: "Product list found.",
                details: products     
            });
        }

    } catch (err) { 
      console.log(err);   
      res.status(500).send({ 
        success: 0, 
        message: err.message 
      });
    }
}

exports.getRoleList = async (req, res) => {
    try {    
        let whereObj = {};

        const queryOptions = {      
            order: [['id', 'ASC']],
        };

        const roles = await Role.findAll(
            {
                include: [
                    {
                        model: Permission,                        
                        attributes: ['id', 'name', 'description'], // optional
                        through: { attributes: [] } // hide junction table
                    }
                ]
            }         
        );

        if(!roles || roles.length === 0) {
            res.status(500).send({ 
                success: 0, 
                message: "No user role found."
            });            
        }else{
            // let obj = userList.toJSON();

            res.status(200).send({
                success: 1, 
                message: "User role list found.",
                details: roles     
            });
        }

    } catch (err) { 
      console.log(err);   
      res.status(500).send({ 
        success: 0, 
        message: err.message 
      });
    }
}