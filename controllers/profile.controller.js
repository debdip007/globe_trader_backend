const db = require("../models/index.js");
const SellerProfile = db.sellerprofile;
const BuyerProfile = db.buyerProfile;
const User = db.User;
const jwt = require("jsonwebtoken");
const { saveBase64Image } = require('../helper/image.helper.js');
const { getProfileDetails } = require('../helper/profile.helper.js');

require("dotenv").config();

exports.updateProfile = async (req, res) => {
  try {
    let user_id = savedPath = "";
    user_id = req.userId;
    let profile_details = {};

    const device_type = req.headers["device_type"];

    const { 
            user_type,
            company_name, 
            website, 
            company_type,
            store_count,
            operation_type,
            business_registration_number,
            business_email_address,
            business_contact_name,
            business_contact_number,
            business_address,
            business_city,
            business_state,
            business_pincode,
            interest_category,
            interest_sub_category,
            country,
            country_code,
            fullname,
            phone,
            profile_image,
            first_name,
            last_name,
            user_role,
            business_description,
            business_country_names 
        } = req.body;

    const user = await User.findOne({
        where: {
            id : user_id,
            user_type : user_type,
            status: 1
        }
    });

    if(user && user != null) {
        if (profile_image) {
            // saveBase64Image(profile_image, "./media/uploads/profile");
            savedPath = await saveBase64Image(profile_image, "./media/uploads/profile");

            const userImage = await User.update({                       
                profile_image : savedPath
            }, 
            {
                where : {id : user.id}    
            });

            profile_details = await getProfileDetails(user_id, user.user_type);
            
            // return res.status(200).send({
            //     success: 1, 
            //     message: "Profile Image updated.",
            //     details : {
            //         id: user.id,
            //         fullname: user.fullname,
            //         email: user.email,      
            //         phone: user.phone,
            //         status: user.status,
            //         user_type: user.user_type,
            //         is_verified: user.is_verified,
            //         country: user.country,
            //         country_code: user.country_code,
            //         platform_type: user.platform_type,
            //         profile_image: user.profile_image != null ? req.protocol  + '://' + req.get('host') + '/images/profile/' +user.profile_image : "",
            //         created_at: user.createdAt,
            //         updated_at: user.updatedAt,
            //         profile_details : profile_details
            //     }                    
            // });
        }

        if(country != "" || country_code != "" || fullname != "" || phone != "") {
            const userDetails = await User.update({                       
                fullname,
                phone,
                country,
                country_code,
                device_type : device_type,
                first_name,
                last_name,
                user_role 
            }, 
            {
                where : {id : user.id}    
            });
        }

        switch (user_type) {
            case "SELLER":
                const checkSeller = await SellerProfile.findOne({
                    where: {
                        seller_id : user_id
                    }
                });

                if(checkSeller && checkSeller != null) {
                    const sellerProfileUpdate = await SellerProfile.update({       
                        company_name,
                        company_type,
                        website,
                        business_registration_number,
                        business_email_address,
                        business_contact_name,
                        business_contact_number,
                        business_address,
                        business_city,
                        business_state,
                        business_pincode,
                        business_description,
                        business_country_names : JSON.stringify(business_country_names)
                    },
                    {
                        where : {id : checkSeller.id} 
                    });
                }else{
                    const sellerProfileCreate = await SellerProfile.create({       
                        seller_id : user_id,
                        company_name,
                        company_type,
                        website,
                        business_registration_number,
                        business_email_address,
                        business_contact_name,
                        business_contact_number,
                        business_address,
                        business_city,
                        business_state,
                        business_pincode,
                        business_description,
                        business_country_names : JSON.stringify(business_country_names)
                    });
                }
                
                // profile_details = await getProfileDetails(user_id, __sellerType);

                // return res.status(200).send({
                //     success: 1, 
                //     message: "User Profile Updated.",
                //     details : {
                //         id: user.id,
                //         fullname: user.fullname,
                //         email: user.email,      
                //         phone: user.phone,
                //         status: user.status,
                //         user_type: user.user_type,
                //         is_verified: user.is_verified,
                //         country: user.country,
                //         country_code: user.country_code,
                //         platform_type: user.platform_type,
                //         profile_image: user.profile_image != null ? req.protocol  + '://' + req.get('host') + '/images/profile/' +user.profile_image : "",
                //         created_at: user.createdAt,
                //         updated_at: user.updatedAt,
                //         profile_details : profile_details
                //     }     
                // });
                break;

            case "BUYER":
                const checkBuyer = await BuyerProfile.findOne({
                    where: {
                        buyer_id : user_id
                    }
                });

                if(checkBuyer && checkBuyer != null) {
                    const buyerProfileUpdate = await BuyerProfile.update({       
                        company_name,
                        website,
                        company_type,
                        store_count,
                        operation_type,
                        business_registration_number,
                        business_email_address,
                        business_contact_name,
                        business_contact_number,
                        business_address,
                        business_city,
                        business_state,
                        business_pincode,
                        interest_category : JSON.stringify(interest_category),
                        interest_sub_category : JSON.stringify(interest_sub_category),
                        business_description,
                        business_country_names : JSON.stringify(business_country_names)
                    },
                    {
                        where : {id : checkBuyer.id}
                    }
                    );
                }else{
                    const buyerProfileCreate = await BuyerProfile.create({       
                        buyer_id : user_id,
                        company_name,
                        website,
                        company_type,
                        store_count,
                        operation_type,
                        business_registration_number,
                        business_email_address,
                        business_contact_name,
                        business_contact_number,
                        business_address,
                        business_city,
                        business_state,
                        business_pincode,
                        interest_category : JSON.stringify(interest_category),
                        interest_sub_category : JSON.stringify(interest_sub_category),
                        business_description,
                        business_country_names : JSON.stringify(business_country_names)
                    });
                }
                
                // profile_details = await getProfileDetails(user_id, __buyerType);

                // return res.status(200).send({
                //     success: 1, 
                //     message: "User Profile Updated.",
                //     details : {
                //         id: user.id,
                //         fullname: user.fullname,
                //         email: user.email,      
                //         phone: user.phone,
                //         status: user.status,
                //         user_type: user.user_type,
                //         is_verified: user.is_verified,
                //         country: user.country,
                //         country_code: user.country_code,
                //         platform_type: user.platform_type,
                //         profile_image: user.profile_image != null ? req.protocol  + '://' + req.get('host') + '/images/profile/' +user.profile_image : "",
                //         created_at: user.createdAt,
                //         updated_at: user.updatedAt,
                //         profile_details : profile_details
                //     }    
                // });
                
                break;
            default:
                break;
        }

        const updatedUser = await User.findOne({
            where: {
                id : user_id,
                user_type : user_type,
                status: 1
            }
        });
        profile_details = await getProfileDetails(user_id, user_type);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 3600 // 1 hours
        });

        return res.status(200).send({
            success: 1, 
            message: "User Profile Updated.",
            details : {
                id: updatedUser.id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,      
                phone: updatedUser.phone,
                status: updatedUser.status,
                user_type: updatedUser.user_type,
                is_verified: updatedUser.is_verified,
                country: updatedUser.country,
                country_code: updatedUser.country_code,
                platform_type: updatedUser.platform_type,
                profile_image: updatedUser.profile_image != null ? req.protocol  + '://' + req.get('host') + '/images/profile/' +updatedUser.profile_image : "",
                created_at: updatedUser.createdAt,
                updated_at: updatedUser.updatedAt,
                accessToken: token,
                first_name : updatedUser.first_name,
                last_name : updatedUser.last_name,
                user_role : updatedUser.user_role, 
                profile_details : profile_details             
            }    
        });
    }else{
        return res.status(401).send({ 
            success: 0,
            message: "User Not found." 
        });
    } 
  } catch (err) {
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }
};

exports.viewProfile = async (req, res) => {
  try {
    let profile_details = {};
    const userID = req.params.id;

    const user = await User.findOne({
      where: {
        id: userID
      }
    });

    if (!user) {
      return res.status(401).send({ 
        success: 0,
        message: "User Not found." 
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 3600 // 1 hours
    });

    profile_details = await getProfileDetails(user.id, user.user_type);

    res.status(200).send({
      success: 1, 
      message: "User Details Found.",
      details : {
        id: user.id,
        fullname: user.fullname,
        email: user.email,      
        phone: user.phone,
        status: user.status,
        user_type: user.user_type,
        is_verified: user.is_verified,
        country: user.country,
        country_code: user.country_code,
        platform_type: user.platform_type,
        profile_image: user.profile_image != null ? req.protocol  + '://' + req.get('host') + '/images/profile/' +user.profile_image : "",
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        accessToken: token,
        profile_details : profile_details,
        first_name : user.first_name,
        last_name : user.last_name,
        user_role : user.user_role
      }      
    });
  } catch (err) {
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }  
};