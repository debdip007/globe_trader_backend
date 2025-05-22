const db = require("../models/index.js");
const Categories = db.category;
require("dotenv").config();

exports.getCategory = async (req, res) => {
  try {
    const category = await Categories.findAll({
        where: {
            parent_id: null
        }
    });

    if (!category || category.length === 0) {
      return res.status(401).send({ 
        success: 0,
        message: "No category found." 
      });
    }

    res.status(200).send({
      success: 1, 
      message: "Category list found.",
      category      
    });
  } catch (err) {
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }
};

exports.getSubCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    const category = await Categories.findAll({
        where: {
            parent_id: categoryId
        }
    });

    if (!category || category.length === 0) {
      return res.status(401).send({ 
        success: 0,
        message: "No sub-category found." 
      });
    }

    res.status(200).send({
      success: 1, 
      message: "Sub-category list found.",
      category      
    });
  } catch (err) {
    res.status(500).send({ 
      success: 0, 
      message: err.message 
    });
  }
};