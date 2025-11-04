const db = require("../models/index.js");
const helper = require("../helper/index.js");
const Sequelize = require('sequelize');
const User = db.User;
const Role = db.Role;
const Permission = db.Permission;
const Categories = db.category;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const product = require("../models/product.js");
const BuyerInterest = db.buyerInterest;
const Products = db.product;
require("dotenv").config();
const { getProfileDetails } = require('../helper/profile.helper.js');
const { productDetailsByID, getUserDetails } = require('../helper/commonHelper.js');

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
                        attributes: ['id', 'name', 'description', 'sort'], // optional
                        through: { attributes: [] }, // hide junction table
                        order: [['sort', 'ASC']]
                    }
                ],
                order: [[{ model: Permission }, 'sort', 'ASC']]
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

exports.getPermissionList = async (req, res) => {
    try {    
        let whereObj = {};

        const queryOptions = {      
            order: [['sort', 'ASC']],
        };

        const permissionList = await Permission.findAll(
            queryOptions         
        );

        if(!permissionList || permissionList.length === 0) {
            res.status(500).send({ 
                success: 0, 
                message: "No permission found."
            });            
        }else{
            res.status(200).send({
                success: 1, 
                message: "Permission list found.",
                details: permissionList     
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

exports.getCategoryList = async (req, res) => {
    try {    
        let whereObj = {parent_id: null};

        const queryOptions = {      
            order: [['id', 'ASC']],
        };

        queryOptions.where = whereObj;

        const categoryList = await Categories.findAll(
            queryOptions         
        );

        if(!categoryList || categoryList.length === 0) {
            res.status(500).send({ 
                success: 0, 
                message: "No category found."
            });            
        }else{
            res.status(200).send({
                success: 1, 
                message: "Category list found.",
                details: categoryList     
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

exports.modifyCategory = async (req, res) => {
    try {        
        const { category_id, name, parent_id, status } = req.body;

        if(category_id == "" || category_id == undefined ) {
            const categoryCreate = await Categories.create({       
                name : name,
                parent_id : parent_id,
                status : status
            });

            if(categoryCreate) {
                return res.status(200).send({
                    success: 1, 
                    message: "Category created successfully!",
                });
            }else{
                res.status(500).send({ 
                    success: 0, 
                    message: "Something went wrong while updating the category" 
                });
            }            
        }else{
            const categoryUpdate = await Categories.update({
                name : name,
                parent_id : parent_id,
                status : status
            },
            {
                where : {id: category_id}
            });

            if(categoryUpdate) {
                return res.status(200).send({
                    success: 1, 
                    message: "Category updated successfully!",
                });
            }else{
                res.status(500).send({ 
                    success: 0, 
                    message: "Something went wrong while updating the category" 
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
}

exports.dashboardDetails = async (req, res) => {
    try {        
        // const { date, user_type } = req.body;

        const date = req.body?.date ? req.body.date : null;
        const user_type = req.body?.user_type ? req.body.user_type : null;  
        
        const userList = await User.findAll({
            attributes: [
                "user_type",
                [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
            ],
            group: ["user_type"]         
        }); 

        const products = await Products.count({
            where: { status: 1 }
        });

        const userListByMonth = await User.findAll({
            attributes: [
                "user_type",
                [Sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m')`), "month"],
                [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
            ],
            group: [
                "user_type",
                Sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m')`)
            ],
            order: [
                ["user_type", "ASC"],
                [Sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m')`), "ASC"]
            ],
            raw: true         
        });  
        
        const formattedMonthlyUser = {};
    
        userListByMonth.forEach(row => {
            if (!formattedMonthlyUser[row.user_type]) {
                formattedMonthlyUser[row.user_type] = [];
            }
            formattedMonthlyUser[row.user_type].push({
                month: row.month,
                count: Number(row.count)
            });
        });

        const requestByMonth = await BuyerInterest.findAll({
            attributes: [
                "user_type",
                [Sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m')`), "month"],
                [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
            ],
            group: [
                "user_type",
                Sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m')`)
            ],
            order: [
                ["user_type", "ASC"],
                [Sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m')`), "ASC"]
            ],
            raw: true         
        });  
        
        const formattedMonthlyRequest = {};
    
        requestByMonth.forEach(row => {
            if (!formattedMonthlyRequest[row.user_type]) {
                formattedMonthlyRequest[row.user_type] = [];
            }
            formattedMonthlyRequest[row.user_type].push({
                month: row.month,
                count: Number(row.count)
            });
        });
        
        const totalRequest = await BuyerInterest.count();
        const approvedRequest = await BuyerInterest.count({
            where : {status : 1}
        });

        const pendingRequest = await BuyerInterest.count({
            where : {status : 0}
        });

        const sellerRequest = await BuyerInterest.count({
            where : {user_type : "SELLER"}
        });

        const buyerRequest = await BuyerInterest.count({
            where : {user_type : "BUYER"}
        });

        return res.status(200).send({
            success: 1, 
            message: "Dashboard details found!",
            details: {
                user_count : userList,
                product_count : products,
                monthly_user_count : formattedMonthlyUser,
                monthly_request : formattedMonthlyRequest,
                total_request : totalRequest,
                approved_request : approvedRequest,
                pending_request : pendingRequest,
                seller_request : sellerRequest,
                buyer_request : buyerRequest
            }
        });
    } catch (err) { 
        console.log(err);
      res.status(500).send({ 
        success: 0, 
        message: err.message 
      });
    }
}

exports.requestProductListByUserType = async (req, res) => {
  try {
    let userType = requestedProducts = "";
    let returnObj = {};
    
    if(req.body !== undefined) {
        userType = req.body.user_type == "" || req.body.user_type == undefined ? "SELLER" : req.body.user_type;    
        requested = req.body.requested == "" || req.body.requested == undefined ? 0 : req.body.requested;    
    }

    switch (userType) {
      case __sellerType:
        requestedProducts = await BuyerInterest.findAll({
          where : {user_type : __buyerType}
        });
        break;
      case __buyerType:
        requestedProducts = await BuyerInterest.findAll({
          where : {user_type : __sellerType}
        });
        break;    
      default:
        break;
    }

    if (!requestedProducts || requestedProducts.length === 0) {
        return res.status(500).send({ 
            success: 0,
            message: "No Products found." 
        });
    }else{           
      const modifiedProductObj = await Promise.all(
        requestedProducts.map(async (item) => {
          const obj = item.toJSON(); // <-- Important!
          obj.accept = parseInt(obj.accept);
          obj.product_details = await productDetailsByID(obj.product_id, req);
          if (userType == __buyerType) {
            obj.user_details = await getUserDetails(obj.seller_id, req);
            if(obj.user_details) {
                obj.user_details.profile_details = await getProfileDetails(obj.seller_id, __sellerType);
            }            
          }else if(userType == __sellerType) {
            obj.user_details = await getUserDetails(obj.buyer_id, req);
            obj.user_details.profile_details = await getProfileDetails(obj.buyer_id, __buyerType);
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
  }catch (err) { 
    console.log(err);   
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }
};