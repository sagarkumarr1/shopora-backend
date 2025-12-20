const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            title: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            variantId: { type: String },
            variantAttributes: { type: Map, of: String }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
