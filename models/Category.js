const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create category slug from the name
// Create category slug from the name
categorySchema.pre('save', async function () {
    if (!this.isModified('name')) {
        return;
    }
    this.slug = slugify(this.name, { lower: true });
});

module.exports = mongoose.model('Category', categorySchema);
