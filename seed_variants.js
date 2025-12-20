const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const importData = async () => {
    try {
        console.log('Seeding Products with Variants...');

        const variantProducts = [
            {
                title: "Premium Polo T-Shirt",
                price: 1299,
                description: "Classic polo t-shirt made with 100% cotton. Perfect for casual outings and semi-formal events. Breathable fabric ensures comfort all day long.",
                category: "Fashion",
                image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80",
                images: [
                    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80",
                    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80"
                ],
                rating: 4.5,
                reviews: [],
                discount: "10%",
                stock: 100,
                variants: [
                    {
                        sku: "POLO-BLU-M",
                        attributes: { "Color": "Blue", "Size": "M" },
                        price: 1299,
                        stock: 20,
                        images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80"]
                    },
                    {
                        sku: "POLO-BLU-L",
                        attributes: { "Color": "Blue", "Size": "L" },
                        price: 1299,
                        stock: 15,
                        images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80"]
                    },
                    {
                        sku: "POLO-RED-M",
                        attributes: { "Color": "Red", "Size": "M" },
                        price: 1299,
                        stock: 10,
                        images: ["https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80"]
                    }
                ]
            },
            {
                title: "Urban Running Shoes",
                price: 3499,
                description: "High-performance running shoes with cushioned soles for maximum comfort. Lightweight design ideal for marathons and daily jogging.",
                category: "Fashion",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
                images: [
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
                    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80"
                ],
                rating: 4.8,
                reviews: [],
                discount: "15%",
                stock: 50,
                variants: [
                    {
                        sku: "SHOE-RED-8",
                        attributes: { "Color": "Red", "Size": "8" },
                        price: 3499,
                        stock: 10,
                        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"]
                    },
                    {
                        sku: "SHOE-RED-9",
                        attributes: { "Color": "Red", "Size": "9" },
                        price: 3499,
                        stock: 12,
                        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"]
                    },
                    {
                        sku: "SHOE-BLK-9",
                        attributes: { "Color": "Black", "Size": "9" },
                        price: 3599, // Slightly more expensive
                        stock: 8,
                        images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80"]
                    }
                ]
            }
        ];

        await Product.create(variantProducts);

        console.log('Products with Variants Imported Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

importData();
