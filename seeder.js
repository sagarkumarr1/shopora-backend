const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const importData = async () => {
    try {
        // Clear existing data (optional, maybe safe to keep users but for this demo refresh is good or just update)
        // Let's just update the specific user to admin if exists, or create one.
        // await User.deleteMany(); 
        await Category.deleteMany();
        await Product.deleteMany();

        console.log('Data Destroyed (Partial)...');

        // Create Admin User if not exists (or update first user to admin)
        // Actually, let's just find the first user and make them admin.
        const users = await User.find({});
        let adminUser;
        if (users.length > 0) {
            users[0].role = 'admin';
            await users[0].save();
            adminUser = users[0];
            console.log(`User ${users[0].email} is now Admin.`);
        } else {
            // Create one if no users
            const u = await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin'
            });
            adminUser = u;
            console.log('Created Admin User: admin@example.com / password123');
        }

        // Create Categories
        const categories = await Category.create([
            { name: 'Mobiles', image: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png' },
            { name: 'Fashion', image: 'https://rukminim1.flixcart.com/flap/128/128/image/c12afc017e6f24cb.png' },
            { name: 'Electronics', image: 'https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png' },
            { name: 'Home', image: 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg' },
        ]);

        console.log('Categories Imported!');

        // Create Products
        const products = [
            {
                title: "Apple iPhone 14 (128GB) - Midnight",
                price: 54999,
                description: "Super Retina XDR display. Advanced camera system for better photos in any light. Cinematic mode now in 4K Dolby Vision up to 30 fps. Action mode for smooth, steady, handheld videos.",
                category: "Mobiles",
                image: "https://images.unsplash.com/photo-1678685888221-c4e9c1851c8e?w=500&q=80",
                rating: 4.6,
                reviews: 3421,
                discount: "21%",
                stock: 10,
                specs: { "Display": "6.1-inch", "Processor": "A15 Bionic" }
            },
            {
                title: "Samsung Galaxy S23 Ultra 5G",
                price: 89999,
                description: "Experience the ultimate with the Galaxy S23 Ultra. Nightography camera, faster processor, and S Pen support.",
                category: "Mobiles",
                image: "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=500&q=80",
                rating: 4.7,
                reviews: 1205,
                discount: "28%",
                stock: 15,
                specs: { "Display": "6.8-inch", "Camera": "200MP" }
            },
            {
                title: "Sony WH-1000XM5 Wireless Headphones",
                price: 24990,
                description: "Industry-leading noise cancellation. Exceptional sound quality. Crystal clear hands-free calling.",
                category: "Electronics",
                image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
                rating: 4.8,
                reviews: 890,
                discount: "15%",
                stock: 20
            }
        ];

        await Product.create(products);

        console.log('Products Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

importData();
