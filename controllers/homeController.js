const Category = require("../models/category.model");
const Subcategory = require("../models/subCategory.model");

exports.getAllCategories = async ( req,res ) => {
    try {
        const categories = await Category.find().populate("subcategories");
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}