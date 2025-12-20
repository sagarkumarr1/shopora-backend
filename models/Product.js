const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a product title'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description can not be more than 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    discount: {
        type: String,
        default: '0%'
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 10
    },
    images: {
        type: [String],
        default: []
    },
    image: {
        type: String,
        required: true
    },
    colors: {
        type: [String],
        default: []
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            images: {
                type: [String],
                default: []
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    numReviews: {
        type: Number,
        default: 0
    },
    specs: {
        type: Map,
        of: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    variants: [
        {
            sku: String,
            attributes: {
                type: Map,
                of: String
            },
            price: Number,
            stock: Number,
            images: [String]
        }
    ]
});

// Create product slug from the name
// Create product slug from the name
// Create product slug from the name
productSchema.pre('save', async function () {
    if (!this.isModified('title')) {
        return;
    }
    const crypto = require('crypto');
    const randomSuffix = crypto.randomBytes(3).toString('hex');
    this.slug = slugify(this.title, { lower: true }) + '-' + randomSuffix;
});

module.exports = mongoose.model('Product', productSchema);
