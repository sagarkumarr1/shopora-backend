const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const collection = mongoose.connection.collection('products');

        // Find documents where reviews is a number (legacy format)
        // Using $type: "number" (BSON type 1 or 16/18 usually, string "number" works in queries)
        // Using aggregation pipeline in update to reference existing fields
        const result = await collection.updateMany(
            { reviews: { $type: "number" } },
            [
                {
                    $set: {
                        numReviews: "$reviews", // Copy old count to numReviews
                        reviews: []             // Reset reviews to empty array
                    }
                }
            ]
        );

        console.log(`Migration complete.`);
        console.log(`Matched and Updated: ${result.modifiedCount} products.`);

        process.exit();
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
