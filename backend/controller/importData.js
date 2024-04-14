const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const router = express.Router();
const Product = require("../model/product");
const Shop = require("../model/shop");
const ImportData = require("../model/importData");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");



// Endpoint to handle product import
router.post(
    "/import-products/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const products = req.body;
        const shopId= req.params.id ;
        // Check if products array is empty or not provided
        if (!Array.isArray(products) || products.length === 0) {
          return next(new ErrorHandler("Please provide product data.", 400));
        }
  
        // Iterate through each product and create in database
        const createdProducts = await Promise.all(
          products.map(async (product) => {
            const {
              Name,
              Description,
              Category,
              DiscountPrice,
              Stock,
              ShopName,
              ImageUrls,
            } = product;
  
            // Find shop by name
            const shop = await Shop.findOne({ name: ShopName });
  
            // If shop doesn't exist, handle gracefully
            if (!shop) {
              console.error(`Shop with name ${ShopName} not found.`);
              // You may choose to return a response to the client instead of throwing an error
              // return res.status(400).json({ success: false, message: `Shop with name ${ShopName} not found.` });
            }
  
            // Upload images to cloudinary if provided
            const imagesLinks = [];
            if (ImageUrls) {
              for (const imageName of ImageUrls.split(",")) {
                // Check if the image exists on Cloudinary by searching for it using its name
                const searchResult = await cloudinary.v2.search
                  .expression(`filename:${imageName}`)
                  .execute();
  
                // If the image exists, retrieve its details
                if (
                  searchResult &&
                  searchResult.resources &&
                  searchResult.resources.length > 0
                ) {
                  const cloudinaryImage = searchResult.resources[0];
                  imagesLinks.push({
                    public_id: cloudinaryImage.public_id,
                    url: cloudinaryImage.secure_url,
                  });
                } else {
                  console.error(
                    `Image with name ${imageName} not found on Cloudinary.`
                  );
                  // Handle the case when the image is not found on Cloudinary
                }
              }
            }
            // Create product object
            const productData = {
              name: Name,
              description: Description,
              category: Category,
              stock: Stock,
              originalPrice: DiscountPrice,
              images: imagesLinks,
              discountPrice: DiscountPrice, // Assuming DiscountPrice represents original price
              discountPrice: DiscountPrice,
              stock: Stock,
              images: imagesLinks,
              shopId: shop ? shop.id : null, // Assign shop ID if found, otherwise null
              shop: shop ? shop : null, // Assign shop ID if found, otherwise null
            };
  
            // Save product to database
            return await Product.create(productData);
          })
        );
  
        // Create importData record
        const importData = {
          status: "Success", // or 'Failed' based on import status
          by: "test", // Assuming user is authenticated and user ID is accessible from request
          type: "Product", // Specify the type of import
          shopId:shopId,
          count: createdProducts.length, // Count of products imported
        };
        await ImportData.create(importData);
  
        res.status(201).json({
          success: true,
          message: `${createdProducts.length} products imported successfully.`,
        });
      } catch (error) {
        return next(
          new ErrorHandler(error.message || "Error occurred during import.", 400)
        );
      }
    })
  );
  // Endpoint to get import data
  router.get(
    "/import-data/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
      try {
        // Fetch import data from database
        const importData = await ImportData.find({ shopId: req.params.id });
  
        res.status(200).json(importData);
      } catch (error) {
        return next(new ErrorHandler("Error fetching import data.", 500));
      }
    })
  );
  module.exports = router;