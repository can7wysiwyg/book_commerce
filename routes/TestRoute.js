const express = require('express');
const fileUpload = require('express-fileupload');
const asyncHandler = require('express-async-handler');
const Testo = require('../models/TestingMod');
const cloudinary = require("cloudinary").v2;
const fs = require('fs');

const TestRoute = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

TestRoute.post('/testingg',  asyncHandler(async (req, res) => {
    if (!req.files || !req.files.testImage) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const file = req.files.testImage;
  
    cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'testImage',
      width: 150,
      height: 150,
      crop: "fill"
    }, async (err, result) => {
      if (err) throw err;
  
      removeTmp(file.tempFilePath);
  
      await Testo.create({
        testImage: result.secure_url
      });
  
      res.json({ url: result.secure_url });
    });
  }));
  

  module.exports = TestRoute

  function removeTmp(filePath) {
    fs.unlink(filePath, err => {
      if (err) throw err;
    });
  }