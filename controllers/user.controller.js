const db = require("../models/index.js");
const UserPreference = db.userPreference;
const BuyerInterest = db.buyerInterest;
require("dotenv").config();

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
    let user_id = savedPath = "";
    user_id = req.userId;

    const device_type = req.headers["device_type"];

    const { seller_id, product_id, status } = req.body;

    // const preference = await BuyerInterest.findAll({
    //     where: {
    //         buyer_id : user_id,
    //         product_id : product_id,
    //         status: 1
    //     }
    // });

    // if (!preference || preference.length === 0) {
        const userPreferenceCreate = await BuyerInterest.create({       
            buyer_id : user_id,
            product_id,
            seller_id,
            status : status,
            notes : '',
            device_type
        });

        res.status(200).send({
            success: 1, 
            message: "Interested added."      
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