const db = require("../models/index.js");
const UserPreference = db.userPreference;
const BuyerInterest = db.buyerInterest;
require("dotenv").config();
const { Op, where } = require('sequelize');
const { productDetailsByID, getUserDetails } = require('../helper/commonHelper.js');
const { getProfileDetails } = require('../helper/profile.helper.js');

exports.savePreference = async (req, res) => {
  try {
    let user_id = savedPath = "";
    user_id = req.userId;

    const { user_type, product_id, preferance, device_type } = req.body;

    const preference = await UserPreference.findAll({
        where: {
            user_id : user_id,
            product_id : product_id,
            status: 1
        }
    });

    if (!preference || preference.length === 0) {
        const userPreferenceCreate = await UserPreference.create({       
            user_id : user_id,
            user_type,
            product_id,
            preferance,
            status : 1,
            device_type
        });

        res.status(200).send({
            success: 1, 
            message: "Preference added."      
        });
    }else{
        if((preference[0].id !== undefined)) {
            const id = preference[0].id;

            const userPreferenceCreate = await UserPreference.update({                       
                preferance,
                status : 1,
                device_type
            }, 
            {
                where : {id : id}    
            });
            res.status(401).send({
                success: 0, 
                message: "Preference updated."      
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

exports.saveInterest = async (req, res) => {
  try {
    let userId = savedPath = seller_id = buyer_id = checkInterest = "";
    userId = req.userId;

    const device_type = req.headers["device_type"];

    const { user_id, user_type, status, notes, product_id } = req.body;

    switch (user_type) {
      case "BUYER":
        seller_id = user_id;
        buyer_id = userId;

        checkInterest = await BuyerInterest.findOne({
          where : {user_type : user_type, seller_id : user_id, product_id: product_id, buyer_id : userId, status : 1}
        });

        if (checkInterest) {
          return res.status(401).send({ 
            success: 0,
            message: "You have already sent request for this item." 
          });
        }
        
        break;
      case "SELLER":
        seller_id = userId;
        buyer_id = user_id;

        checkInterest = await BuyerInterest.findOne({
          where : {user_type : user_type, seller_id : userId, buyer_id : user_id, status : 1}
        });

        if (checkInterest) {
          return res.status(401).send({ 
            success: 0,
            message: "You have already sent request to this Buyer." 
          });
        }

        break;    
      default:
        break;
    }

    // const preference = await BuyerInterest.findAll({
    //     where: {
    //         buyer_id : user_id,
    //         product_id : product_id,
    //         status: 1
    //     }
    // });

    // if (!preference || preference.length === 0) {
        const userPreferenceCreate = await BuyerInterest.create({       
            buyer_id : buyer_id,
            user_type,
            seller_id : seller_id,
            product_id : product_id,
            status : status,
            notes : notes,
            accept : 0,
            device_type
        });

        res.status(200).send({
            success: 1, 
            message: "Interest added."      
        });
    // }else{
        // if((preference[0].id !== undefined)) {
        //     const id = preference[0].id;

        //     const userPreferenceCreate = await UserPreference.update({       
        //         user_id,
        //         user_type,
        //         product_id,
        //         preferance,
        //         status : 1,
        //         device_type
        //     }, 
        //     {
        //         where : {id : id}    
        //     });
        //     res.status(401).send({
        //         success: 0, 
        //         message: "Preference updated."      
        //     });
        // }        
    // }    
  } catch (err) {
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }
};

exports.updateInterest = async (req, res) => {
  try {    
    userId = req.userId;
    const device_type = req.headers["device_type"];

    const { id, status, accept} = req.body;

    const interestUpdate = await BuyerInterest.update({
      status : status,
      accept : accept 
    },
    {
      where : {id: id}
    });
    
    if(interestUpdate) {
      res.status(200).send({
          success: 1, 
          message: "Interest Updated."      
      });
    }      
  } catch (err) {
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }
};

exports.requestProductList = async (req, res) => {
  try {
    let userType = requestedProducts = "";
    let returnObj = {};
    
    if(req.body !== undefined) {
        userType = req.body.user_type == "" || req.body.user_type == undefined ? "SELLER" : req.body.user_type;    
        requested = req.body.requested == "" || req.body.requested == undefined ? 0 : req.body.requested;    
    }

    userId = req.userId;

    switch (userType) {
      case __sellerType:
        requestedProducts = await BuyerInterest.findAll({
          where : {user_type : __buyerType, seller_id : userId, status : 1, accept: {[Op.ne]: 2}}
        });
        break;
      case __buyerType:
        requestedProducts = await BuyerInterest.findAll({
          where : {user_type : userType, buyer_id : userId, status : 1}
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
            obj.user_details.profile_details = await getProfileDetails(obj.seller_id, __sellerType);
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
