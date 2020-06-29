const express = require("express");

const City = require("../models/cities");
const router = express.Router();
  
router.post("/add", (req, res , next) => {
    const newCity = new City({
        name: req.body.name
    })
    newCity.save().then(result=>{
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
