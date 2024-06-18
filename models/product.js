const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide product name.'],
        trim: true,
        maxLength: [120, 'Product name should not be more than 120 characters']
    },
    price: {
        type: Number,
        required: [true, 'please provide product price.'],
        maxLength: [4, 'Product price should not be more than 5 digits'],
    },
    description: {
        type: String,
        required: [true, 'please provide product description.']
    },
    photos: [
        {
            id: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'please provide product category.'],
        enum:{
            values: [
                'shortsleeves',
                'longsleeves',
                'sweatshirts',
                'hoodies'
            ],
            message: 'Please select category only from mentioned choices'
        }
    },
    brand:{
        type: String,
        required: [true,'please add a brand.']
    },
    ratings: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
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
            comment:{
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Product', productSchema)
