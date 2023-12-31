const BookRoute = require("express").Router();
const Book = require("../models/BookModel");
const asyncHandler = require("express-async-handler");
const verify = require("../middleware/verify");
const authAdmin = require("../middleware/authAdmin");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});



BookRoute.post(
  "/book/create",
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
      if (!bookPrice) {
        throw new Error("book price cannot be empty");
      }
      if (!bookReleaseDate) {
        throw new Error("book release date cannot be empty");
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


        await Book.create({
          bookAuthor,
          bookDescription,
          bookGenre,
          bookPrice,
          bookReleaseDate,
          bookTitle,
          bookImage: result.secure_url,
        }); 
  
        res.json({ msg: "book has been successfully created!" });
    
      });

  
    } catch (error) {
      next(error);
    }
  })
);


BookRoute.put(
  "/book/update_image/:id",
  verify,
  authAdmin,
  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;

      const book = await Book.findById(id);

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





BookRoute.put(
  "/book/update_info/:id",
  verify,
  authAdmin,
  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;

      await Book.findByIdAndUpdate(id, req.body, { new: true });

      res.json({ success: true, msg: "book has been successfully updated!" });
    } catch (error) {
      next(error);
    }
  })
);

BookRoute.delete(
  "/book/delete_single/:id",
  verify,
  authAdmin,
  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;

      await Book.findByIdAndDelete(id);

      res.json({ success: true, msg: "book has been successfully deleted" });
    } catch (error) {
      next(error);
    }
  })
);

BookRoute.delete(
    "/book/delete_by_author_name",
    verify,
    authAdmin,
    asyncHandler(async (req, res, next) => {
      try {
        const { bookAuthor } = req.body;
  
        if (!bookAuthor) {
          return res.status(400).json({ error: "Book author cannot be empty" });
        }
  
        const result = await Book.deleteMany({ bookAuthor });
  
        res.json({
          success: true,
          msg: `All books associated with the author "${bookAuthor}" have been deleted!`,
          deletedCount: result.deletedCount,
        });
      } catch (error) {
        next(error);
      }
    })
  );
  


BookRoute.get('/book/show_all', asyncHandler(async(req, res, next) => {

    try {
        const books = await Book.find().sort({ _id: -1 })
        res.json({success: true, data: books})
        
    } catch (error) {
        next(error)
    }

}))

BookRoute.get('/book/get_single/:id', asyncHandler(async(req, res, next) => {

    try {
        const{id} = req.params

        const books = await Book.findOne({_id: id})

        res.json({books})
        
    } catch (error) {
        next(error)
    }



}))

BookRoute.get('/book/show_authors_books/bk', asyncHandler(async (req, res, next) => {
    try {
      const { bookAuthor } = req.query;
  
      if (!bookAuthor) {
        throw new Error("Book author needs to be specified");
      }
  
      const books = await Book.find({ bookAuthor });
  
      res.json({ success: true, data: books });
    } catch (error) {
      next(error);
    }
  }));

  BookRoute.get('/book/show_by_genre/gnr', asyncHandler(async(req, res, next) => {
    try {
      const genre = req.query.genre;
      const books = await Book.find({ BookGenre: genre });
      res.json({ books });
    } catch (error) {
      next(error);
    }
  }));
  

BookRoute.get('/book/show', asyncHandler(async (req, res, next) => {
  try {
    const results = await Book.find().sort({ _id: -1 }).limit(4);

    
    res.json({results});
  } catch (error) {
    next(error);
  }
}));

BookRoute.get('/book/popular', asyncHandler(async (req, res, next) => {
  try {
    const results = await Book.find().sort({ _id: -1 }).limit(4);

    
    res.json({results});
  } catch (error) {
    next(error);
  }
}));

 


module.exports = BookRoute;

function removeTmp(filePath) {
  fs.unlink(filePath, err => {
    if (err) throw err;
  });
}