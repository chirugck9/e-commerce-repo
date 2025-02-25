const Product = require("../models/product.model");

exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findOne({ _id: productId }).lean();

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};