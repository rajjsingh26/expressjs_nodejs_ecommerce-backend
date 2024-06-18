const BigPromise = require("../middlewares/bigPromise");
const Product = require('../models/product')
const CustomError = require("../utils/customError.js");
const cloudinary = require("cloudinary");
const WhereClause = require('../utils/whereClause.js');

exports.addProduct = BigPromise(async (req, res, next) => {
    // images
    let imageArray = [];

    if (!req.files) {
        return next(new CustomError("Images are required"))
    }

    if (req.files) {
        for (let index = 0; index < req.files.photos.length; index++) {
            let result = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath, {
                folder: "products"
            });

            imageArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            })
        }
    }

    req.body.photos = imageArray
    req.body.user = req.user.id

    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        product
    })
})

exports.getAllProduct = BigPromise(async (req, res, next) => {

    const resultPerPage = 6
    const totalcountProduct = await Product.countDocuments();

    const productsObj = new WhereClause(Product.find(), req.query).search().filter();

    let products = productsObj.base.clone();

    const filteredProductNumber = products.length;

    // products.limit().skip();

    productsObj.pager(resultPerPage);
    products = await productsObj.base

    res.status(200).json({
        success: true,
        products,
        filteredProductNumber,
        totalcountProduct
    })
})


exports.adminGetAllProduct = BigPromise(async (req, res, next) => {
    const product = await Product.find({})

    res.status(200).json({
        success: true,
        product
    })
})


exports.getOneProduct = BigPromise(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new CustomError("No Product Found"), 401);
    }

    res.status(200).json({
        success: true,
        product
    })
})


exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    let imagesArray = [];

    if (!product) {
        return next(new CustomError("No Product Found"), 401);
    }

    if (req.files) {
        console.log("file present");
        // destroy the existing images and then upload and save the images

        for (let index = 0; index < product.photos.length; index++) {
            await cloudinary.v2.uploader.destroy(product.photos[index].id);
        }

        for (let index = 0; index < req.files.photos.length; index++) {
            let result = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath, {
                folder: "products" //folder name => .env
            });

            imagesArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            })
        }
    }

    console.log(imagesArray)

    req.body.photos = imagesArray

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
})

exports.adminDeleteOneProduct = BigPromise(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new CustomError("No Product Found"), 401);
    }

    for (let index = 0; index < product.photos.length; index++) {
        await cloudinary.v2.uploader.destroy(product.photos[index].id);
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product was deleted!"
    })
})


exports.addReview = BigPromise(async (req, res, next) => {
    const { rating, comment, productId } = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const alreadyReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.comment = comment
                review.rating = rating
            }
        })
    } else {
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length;
    }

    // adjust ratings

    product.ratings = product.reviews.reduce((acc,item) => item.rating + acc, 0)/ product.reviews.length;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true
    })
})


exports.deleteReview = BigPromise(async (req, res, next) => {
    const {productId } = req.query

    const product = await Product.findById(productId);

    const reviews = product.reviews.filter(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    console.log(reviews)

    const numberOfReviews = reviews.length;
    // adjust ratings

    const ratings = product.reviews
    .reduce((acc,item) => item.rating + acc, 0)/ product.reviews.length;

    // update the product

    await Product.findByIdAndUpdate(productId, {
        reviews,
        numberOfReviews,
        ratings
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    })
})