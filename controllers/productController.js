const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        let query = {};

        // Keyword Search
        if (req.query.keyword) {
            query.title = { $regex: req.query.keyword, $options: 'i' };
        }

        // Category Filter
        if (req.query.category) {
            query.category = { $in: req.query.category.split(',') };
        }

        // Price Filter
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        // Rating Filter
        if (req.query.rating) {
            query.rating = { $gte: Number(req.query.rating) };
        }

        // Sorting
        let sort = {};
        if (req.query.sort) {
            if (req.query.sort === 'price_low') sort.price = 1;
            else if (req.query.sort === 'price_high') sort.price = -1;
            else if (req.query.sort === 'newest') sort.createdAt = -1;
            else if (req.query.sort === 'best_deal') {
                query.discount = { $ne: '0%' }; // Filter products with discount
                sort.price = 1; // Sort by lowest price
            }
        }

        const products = await Product.find(query).sort(sort);
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        let product;

        // Check if id is a valid ObjectId
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(req.params.id);
        } else {
            // Otherwise treat as slug
            product = await Product.findOne({ slug: req.params.id });
        }

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get search suggestions
// @route   GET /api/products/suggestions?q=keyword
// @access  Public
exports.getSuggestions = async (req, res) => {
    try {
        const keyword = req.query.q;
        if (!keyword) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        // Limit results to 5 for suggestions
        const products = await Product.find({
            title: { $regex: keyword, $options: 'i' }
        }).select('title _id image category').limit(5);

        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get best deals by category (min price)
// @route   GET /api/products/deals
// @access  Public
exports.getCategoryDeals = async (req, res) => {
    try {
        const deals = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    minPrice: { $min: "$price" },
                    image: { $first: "$image" }
                }
            },
            {
                $project: {
                    category: "$_id",
                    minPrice: 1,
                    image: 1,
                    _id: 0
                }
            },
            { $sort: { minPrice: 1 } }
        ]);

        res.status(200).json({ success: true, count: deals.length, data: deals });
    } catch (err) {
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
    try {
        const { rating, comment, images } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            // Handle legacy data where reviews might be a number
            if (!Array.isArray(product.reviews)) {
                product.reviews = [];
            }

            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user.id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ success: false, error: 'Product already reviewed' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                images: images || [],
                user: req.user.id
            };

            product.reviews.push(review);

            product.numReviews = product.reviews.length;

            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ success: true, message: 'Review added' });
        } else {
            res.status(404).json({ success: false, error: 'Product not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
