const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary'); // Assuming you've already configured Cloudinary

// Route to upload image to Cloudinary
router.post('/upload-image', async (req, res, next) => {
    try {
      const base64Image = req.body.image;
  
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'products', // Folder in Cloudinary where the image will be stored
      });
  
      // Respond with public ID and URL of the uploaded image
      res.json({
        public_id: result.public_id,
        imageUrl: result.secure_url,
      });
    } catch (error) {
      // Handle errors
      console.error('Error uploading image to Cloudinary:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;