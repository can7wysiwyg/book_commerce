require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port  = process.env.PORT || 5500
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const AdminRoute = require('./routes/AdminRoute')
const BookRoute = require('./routes/BookRoute')
const NewBookRoute = require('./routes/NewBookRoute')
const GenreRoute = require('./routes/GenreRoute')
const CartRoute = require('./routes/CartRoute')
const TestRoute = require('./routes/TestRoute')


mongoose.connect(process.env.MONGOURL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(){
    console.log("connected to database");
  });


  app.use(cors())

  app.use("/uploads/", express.static(path.join(__dirname, '/uploads/')));

  app.use(express.json({limit: '50mb'}))
  app.use(express.urlencoded({extended: true, limit: '50mb'}))
  app.use(cookieParser())
  app.use(fileUpload({
    useTempFiles: true
}))
  

  


  // api routes

  app.use(AdminRoute)
  app.use(BookRoute)
  app.use(NewBookRoute)
  app.use(GenreRoute)
  app.use(CartRoute)
  app.use(TestRoute)


  app.listen(port, () => {
    console.log(`Your server is now running on port ${port}`);
})
