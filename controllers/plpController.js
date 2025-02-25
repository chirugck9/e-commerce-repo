const Product = require("../models/product.model");

exports.getProducts = async (req, res) => {
	try {
		const { category_id, subcategory_id, sort, filters } = req.query;

		let query = {};

		if (category_id) {
			query.category_id = parseInt(category_id);
		}
		console.log(category_id);

		if (subcategory_id) {
			query.subcategory_id = parseInt(subcategory_id);
		}

		// Apply filters (e.g., price range, brand, size)
		if (filters && Object.keys(filters).length > 0) {
			const filterParams = JSON.parse(filters);
			if (filterParams.price) {
				query.price = {
					$gte: filterParams.price.min,
					$lte: filterParams.price.max,
				};
			}
			if (filterParams.brand) {
				query.brand = filterParams.brand;
			}
			if (filterParams.size) {
				query.sizes = filterParams.size;
			}
			if (filterParams.color) {
				query.colors = filterParams.color;
			}
		}

		// Apply sorting (e.g., price low to high, price high to low)
		let sortQuery = {};
		if (sort === "price_asc") {
			sortQuery.price = 1;
		} else if (sort === "price_desc") {
			sortQuery.price = -1;
		} else if (sort === "newest") {
			sortQuery.created_at = -1;
		}

		console.log("Final Query:", query);
		console.log("Sort Query:", sortQuery);

		const products = await Product.find(query).sort(sortQuery).lean();
		return res.status(200).json(products);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
