const express = require("express");

const Category = require("../models/categories");
const router = express.Router();
  
router.post("/add", (req, res , next) => {
    const newCategory = new Category({
        name: req.body.name
    })
    newCategory.save().then(result=>{
        console.log(result);
        res.status(201).json(result)
    }).catch(err => {
        console.log(err);
        res.status(500).json({
        message: 'oooops something went wrong with the new city'
        });
    })
})

module.exports = router;
