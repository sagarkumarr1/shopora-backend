const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const crypto = require('crypto');
const Product = require('./models/Product');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const migrateSlugs = async () => {
    try {
        console.log('Starting Slug Migration...');
        const products = await Product.find({});
        console.log(`Found ${products.length} products.`);

        let count = 0;
        for (const product of products) {
            // Always regenerate slug to be safe/consistent
            if (product.title) {
                const randomSuffix = crypto.randomBytes(3).toString('hex');
                const newSlug = slugify(product.title, { lower: true }) + '-' + randomSuffix;

                // Force update even if part matches (to ensure suffix)
                product.slug = newSlug;
                await product.save();
                console.log(`Updated slug for: ${product.title} -> ${newSlug}`);
                count++;
            }
        }

        console.log(`Migration Complete. Updated ${count} products.`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

migrateSlugs();
