const NewBookRoute = require("express").Router();
const NewBook = require("../models/NewBook");
const asyncHandler = require("express-async-handler");
const verify = require("../middleware/verify");
const authAdmin = require("../middleware/authAdmin");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./photos/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

NewBookRoute.post(
  "/newbook/create",
  verify,
  authAdmin,
  upload.single("bookImage"),
  asyncHandler(async (req, res, next) => {
    try {
      const {
        bookTitle,
        bookGenre,
        bookDescription,
        bookPrice,
        bookReleaseDate,
        bookAuthor,
      } = req.body;

      if (!bookTitle) {
        throw new Error("the book title cannot be empty");
      }
      if (!bookGenre) {
        throw new Error("book genre cannot be empty");
      }
      if (!bookDescription) {
        throw new Error("book description cannot be empty");
      }

      if (!bookAuthor) {
        throw new Error("book author cannot be empty");
      }

      const result = await cloudinary.uploader.upload(req.file.path);

      // Deletes  temporary file from photos folder as images are being uploaded to cloudinary
      fs.unlinkSync(req.file.path);

      await NewBook.create({
        bookAuthor,
        bookDescription,
        bookGenre,
        bookPrice,
        bookReleaseDate,
        bookTitle,
        bookImage: result.secure_url,
      });

      res.json({
        success: true,
        msg: "new book has been created successfully",
      });
    } catch (error) {
      next(error);
    }
  })
);

NewBookRoute.put(
  "/newbook/update_image/:id",
  verify,
  authAdmin,
  upload.single("bookImage"),
  asyncHandler(async (req, res, next) => {

    try {
        const { id } = req.params;
  
        // Find the author in the database
        const newbook = await NewBook.findById(id);
  
        // Check if the new book exists
        if (!newbook) {
          return res.status(404).json({ msg: "Book not found." });
        }
  
        // Delete the old image from Cloudinary if it exists
        if (newbook.bookImage) {
          const publicId = newbook.bookImage.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
  
        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
  
        // Update the book's profile picture in the database
        book.bookImage = result.secure_url; // Save the new image URL in the database
  
        await newbook.save();
  
        // Delete the image file from the temporary uploads folder
        fs.unlinkSync(req.file.path);
  
        res.json({ msg: "book picture updated successfully." });
      } catch (error) {
        next(error);
      }

  })
);


NewBookRoute.put('/newbook/book_update_info/:id', verify, authAdmin, asyncHandler(async(req, res, next) => {
try{
    const { id } = req.params;

    await NewBook.findByIdAndUpdate(id, req.body, { new: true });

    res.json({ success: true, msg: "book has been successfully updated!" });
  } catch (error) {
    next(error);
  } 


} ))

NewBookRoute.delete('/newbook/delete/:id', verify, authAdmin, asyncHandler(async(req, res, next) => {

    try {
        const {id} = req.body

        await NewBook.findByIdAndDelete(id)
        
        res.json({success: true, msg: "book has been successfully deleted"})
        
    } catch (error) {
        next(error)
    }

}))

NewBookRoute.get('/newbook/show_all', asyncHandler(async(req, res, next) => {

    try {
        const books = await NewBook.find()
        res.json({success: true, data: books})
        
    } catch (error) {
        next(error)
    }

}))

NewBookRoute.get('/newbook/show_single/:id', asyncHandler(async(req, res, next) => {
    try {

        const {id} = req.params

        const book = await NewBook.findOne({_id: id})
        res.json({success: true, data: books})
        
    } catch (error) {
        next(error)
    }
}))

NewBookRoute.get('/newbook/show_by_genre/gnr', asyncHandler(async(req, res, next) => {

    try {
    
        const books = await NewBook.find({BookGenre: req.query.genre})
    
        res.json({books})
       
        
    } catch (error) {
        next(error)
    }
    
    
      }))
      
    
      NewBookRoute.get('/newbook/show_authors_books', asyncHandler(async (req, res, next) => {
        try {
          const { bookAuthor } = req.query;
      
          if (!bookAuthor) {
            throw new Error("Book author needs to be specified");
          }
      
          const books = await NewBook.find({ bookAuthor });
      
          res.json({ success: true, data: books });
        } catch (error) {
          next(error);
        }
      }));
    
    


module.exports = NewBookRoute;
