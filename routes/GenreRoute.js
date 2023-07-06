const GenreRoute = require('express').Router()
const asyncHandler = require('express-async-handler')
const Genre = require('../models/GenreModel')
const verify = require('../middleware/verify')
const authAdmin = require('../middleware/authAdmin')


GenreRoute.post('/genre/create', verify, authAdmin, asyncHandler(async(req, res, next) => {

    try {

        const{name} = req.body
        if(!name) {
            
          throw new Error  ( "category name cannot be empty")
        
        
        }

        await Genre.create({
            name
        })

        res.json({success: true, msg: "genre has been succesfully created."})
        
    } catch (error) {
      next(error)  
    }

}))


GenreRoute.put('/genre/edit/:id', verify, authAdmin, asyncHandler(async(req, res, next) => {

try {
    const {id} = req.params

    await Genre.findByIdAndUpdate(id, req.body, {new: true})

    res.json({success: true, msg: "succesfully updated the category"})
    
} catch (error) {
    next(error)
}

}))

GenreRoute.delete('/genre/delete/:id', verify, authAdmin, asyncHandler(async(req, res, next) => {

try {
    const {id} = req.params

    await Genre.findByIdAndDelete(id)
    res.json({success: true, msg: "successfully deleted..."})
    
} catch (error) {
    next(error)
}

}))


GenreRoute.get('/genre/show_all', asyncHandler(async(req, res, next) => {

try {

    const genres = await Genre.find()
    res.json({ success: true, data: genres });

    
} catch (error) {
    next(error)
}


}))


module.exports = GenreRoute