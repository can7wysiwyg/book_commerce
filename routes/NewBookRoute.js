const NewBookRoute = require("express").Router();
const NewBook = require("../models/NewBook");
const asyncHandler = require("express-async-handler");
const verify = require("../middleware/verify");
const authAdmin = require("../middleware/authAdmin");
const fs = require("fs");
const path = require("path");
const { log } = require("console");
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

NewBookRoute.post(
  "/newbook/create",
  verify,
  authAdmin,
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

      if (!req.files || !req.files.bookImage) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const file = req.files.bookImage;


      cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'testImage',
        width: 150,
        height: 150,
        crop: "fill"
      }, async (err, result) => {
        if (err) throw err;
    
        removeTmp(file.tempFilePath);


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
  
  asyncHandler(async (req, res, next) => {

    try {
      const { id } = req.params;

      const book = await NewBook.findById(id);

      if (!book) {
        return res.status(404).json({ msg: "Book not found." });
      }

      if (book.bookImage) {
        const publicId = book.bookImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: "No file uploaded." });
      }

      const bookImage = req.files.bookImage;

      const result = await cloudinary.uploader.upload(bookImage.tempFilePath);

      book.bookImage = result.secure_url;

      await book.save();

      fs.unlinkSync(bookImage.tempFilePath);

      res.json({ msg: "Book picture updated successfully." });
        
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


NewBookRoute.delete(
  "/newbook/delete_single/:id",
  verify,
  authAdmin,
  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;

      await NewBook.findByIdAndDelete(id);

      res.json({ success: true, msg: "book has been successfully deleted" });
    } catch (error) {
      next(error);
    }
  })
);



NewBookRoute.get('/newbook/show_all', asyncHandler(async(req, res, next) => {

    try {
        const books = await NewBook.find().sort({ _id: -1 })
        res.json({success: true, data: books})
        
    } catch (error) {
        next(error)
    }

}))


NewBookRoute.get('/newbook/show_slide', asyncHandler(async(req, res, next) => {

try {

  const results = await NewBook.find().sort({ _id: -1 }).limit(3);

    
  res.json({results});
  
} catch (error) {
  next(error)
}

}))


NewBookRoute.get('/newbook/show_single/:id', asyncHandler(async(req, res, next) => {
    try {

        const {id} = req.params

        const book = await NewBook.findOne({_id: id})
        res.json({success: true, data: book})
        
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
      
    
      NewBookRoute.get('/newbook/show_authors_books/bk', asyncHandler(async (req, res, next) => {
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

function removeTmp(filePath) {
  fs.unlink(filePath, err => {
    if (err) throw err;
  });
}