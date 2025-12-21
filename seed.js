const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');

dotenv.config();
connectDB();

const products = [
    {
        title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        description: "The Sony WH-1000XM5 headphones offer industry-leading noise cancellation and magnificent sound quality. With up to 30 hours of battery life, they are perfect for long trips.",
        price: 29990,
        discount: "15% off",
        category: "Electronics",
        stock: 50,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.8,
        numReviews: 120,
        brand: "Sony"
    },
    {
        title: "Apple MacBook Air M2",
        description: "Supercharged by M2. The redesigned MacBook Air is more portable than ever and weighs just 1.24 kg. It’s the ultra-capable laptop that lets you work, play or create just about anything — anywhere.",
        price: 114900,
        discount: "10% off",
        category: "Electronics",
        stock: 20,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=1000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.9,
        numReviews: 85,
        brand: "Apple"
    },
    {
        title: "Samsung Galaxy S24 Ultra",
        description: "Unleash new ways to create, connect and more. The new era of mobile AI is here. Epic, just like that.",
        price: 129999,
        discount: "5% off",
        category: "Electronics",
        stock: 30,
        image: "https://images.unsplash.com/photo-1610945265078-38584e12a87e?q=80&w=1000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1610945265078-38584e12a87e?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.7,
        numReviews: 200,
        brand: "Samsung"
    },
    {
        title: "Men's Slim Fit Casual Shirt",
        description: "A stylish and comfortable slim fit shirt for men. Made from 100% cotton, perfect for casual outings and office wear.",
        price: 1299,
        discount: "40% off",
        category: "Fashion",
        stock: 100,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.2,
        numReviews: 45,
        brand: "Roadster"
    },
    {
        title: "Women's Floral Maxi Dress",
        description: "Beautiful floral print maxi dress, perfect for summer. Lightweight fabric and elegant design.",
        price: 2499,
        discount: "20% off",
        category: "Fashion",
        stock: 80,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.5,
        numReviews: 60,
        brand: "Zara"
    },
    {
        title: "Nike Air Jordan 1 High",
        description: "The classic Air Jordan 1 High. Premium leather upper, iconic design, and comfortable cushioning.",
        price: 16995,
        discount: "0% off",
        category: "Fashion",
        stock: 15,
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.8,
        numReviews: 150,
        brand: "Nike"
    },
    {
        title: "Modern 3-Seater Sofa",
        description: "Elegant 3-seater sofa with premium fabric upholstery. Perfect for your living room.",
        price: 45000,
        discount: "25% off",
        category: "Home",
        stock: 10,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.6,
        numReviews: 30,
        brand: "IKEA"
    },
    {
        title: "Ceramic Coffee Mugs (Set of 4)",
        description: "Handcrafted ceramic coffee mugs. Microwave and dishwasher safe.",
        price: 899,
        discount: "10% off",
        category: "Home",
        stock: 200,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop"],
        rating: 4.3,
        numReviews: 90,
        brand: "HomeCentre"
    }
];

const seedData = async () => {
    try {
        await Product.deleteMany({}); // Optional: clear existing products
        await Product.insertMany(products);
        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error with data import:', error);
        process.exit(1);
    }
};

seedData();
