const express = require("express");
const router = express.Router();

const Reviews = require("../models/reviews");
const Courses = require("../models/courses");

router.post("/addRevieww", (req, res, next) => {
    const today = new Date();
   
    Reviews.create({
      reviewComment: req.body.reviewComment,
      reviewRate: req.body.reviewRate,
      student: req.body.student,
      course : req.body.course,
      created: today,
   }, function(err, newReview) {
       if (err) {
         console.log(err);
           // handle error
       } else {
              Courses.findOneAndUpdate(
                  { _id:req.body.course},
                  { "$push": {
                      "reviews": newReview._id
                  }}
              ).then((result)=>{
                  res.status(200).json(result)
              })
      
         
          
       }
   });
  });


module.exports = router;
