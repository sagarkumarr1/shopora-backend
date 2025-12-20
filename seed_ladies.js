const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const seedLadies = async () => {
    try {
        console.log('Starting Seeding...');

        // 1. Ensure Categories Exist
        const categories = [
            { name: 'Handbags', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&q=80' },
            { name: 'Heels', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80' },
            { name: 'Womens Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80' }
        ];

        for (const cat of categories) {
            const exists = await Category.findOne({ name: cat.name });
            if (!exists) {
                await Category.create(cat);
                console.log(`Created Category: ${cat.name}`);
            } else {
                console.log(`Category exists: ${cat.name}`);
            }
        }

        // 2. Add Products
        const products = [
            // Handbags
            {
                title: "Classic Leather Tote Bag",
                price: 2499,
                description: "Spacious premium leather tote bag, perfect for office and daily use. Durable and stylish.",
                category: "Handbags",
                image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80",
                rating: 4.5,
                reviews: 124,
                discount: "40%",
                stock: 20
            },
            {
                title: "Elegant Evening Clutch",
                price: 1299,
                description: "Beautiful clutch for parties and weddings. Comes with a detachable chain strap.",
                category: "Handbags",
                image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80",
                rating: 4.7,
                reviews: 89,
                discount: "20%",
                stock: 15
            },
            {
                title: "Boho Fringe Sling Bag",
                price: 899,
                description: "Trendy sling bag with fringe details. Great for casual outings.",
                category: "Handbags",
                image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
                rating: 4.3,
                reviews: 210,
                discount: "50%",
                stock: 30
            },

            // Heels
            {
                title: "Black Pointed Stilettos",
                price: 1999,
                description: "Classic black stiletto heels. Essential for every wardrobe. 4-inch heel height.",
                category: "Heels",
                image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80",
                rating: 4.6,
                reviews: 150,
                discount: "30%",
                stock: 25
            },
            {
                title: "Beige Block Heels",
                price: 1499,
                description: "Comfortable block heels suitable for all-day wear. Cushioned sole.",
                category: "Heels",
                image: "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?w=500&q=80",
                rating: 4.4,
                reviews: 95,
                discount: "25%",
                stock: 18
            },
            {
                title: "Strappy Party Wedges",
                price: 1799,
                description: "Stylish gladiator style wedges. Perfect combination of style and comfort.",
                category: "Heels",
                image: "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?w=500&q=80",
                rating: 4.8,
                reviews: 76,
                discount: "15%",
                stock: 12
            },

            // Women's Fashion
            {
                title: "Floral Maxi Dress",
                price: 1599,
                description: "Flowy floral maxi dress for summer. Breathable fabric.",
                category: "Womens Fashion",
                image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80",
                rating: 4.5,
                reviews: 300,
                discount: "35%",
                stock: 40
            },
            {
                title: "Designer Silk Saree",
                price: 3999,
                description: "Traditional silk saree with intricate embroidery. Blouse piece included.",
                category: "Womens Fashion",
                image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80",
                rating: 4.9,
                reviews: 50,
                discount: "10%",
                stock: 5
            }
        ];

        await Product.create(products);
        console.log(`Imported ${products.length} new products!`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedLadies();
