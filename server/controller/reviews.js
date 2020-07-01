const express = require("express");
const router = express.Router();

const Reviews = require("../models/reviews");
const Courses = require("../models/courses");
const reviews = require("../models/reviews");

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


// //////// soft delete review
router.get("/delete/:id", (req, res) => {
    Reviews.findOneAndUpdate({_id: req.params.id},{visibility: false},
        {new: true ,useFindAndModify: false}).then(review=>{
        res.status(200).json(review);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
        message: 'Data Not Found'
        });
    })
})

module.exports = router;
