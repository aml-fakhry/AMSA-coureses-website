const express = require("express");
const mongoose=require('mongoose');
const Courses = require("../models/courses");
const branches = require("../models/branches");
const Cities = require("../models/cities");
const Reviews = require("../models/reviews");
const categories = require("../models/categories");
const students = require("../models/students");
const courses = require("../models/courses");

const router = express.Router();
  
router.post("/add", (req, res , next) => {
    const newCourse = new Courses({
        name: req.body.name,
        video: req.body.video,
        description: req.body.description,
        price: req.body.price,
        syllabus: req.body.syllabus,
        aboutProgram: req.body.aboutProgram,
        type: req.body.type,
        skillLevel: req.body.skillLevel,
        startingDate: req.body.startingDate,
        endingDate: req.body.endingDate,
        duration: req.body.duration,
        trainers: req.body.trainers,
        category: req.body.category,
        learners:req.body.learners,
        reviews: req.body.reviews
    })
    console.log(newCourse);
    
    newCourse.save().then(result=>{
       console.log(result);
        res.status(201).json(result)
    }).catch(err => {
        console.log(err);
        res.status(500).json({
        
        message: 'oooops something went wrong with the new course'
        });
    })
})

// /////////////////////////// get all courses

router.get("/list", (req, res ) => {
    Courses.find().populate({path:'category',select:'name -_id'}).then(courses=>{
        console.log("you got "+courses.length+" courses")
        res.status(201).json(courses)   
    }).catch(err => {
        console.log(err);
        res.status(500).json({
        message: 'oooops something went wrong with courses'
        });
    })
})

// all courses paganited
router.post('/allCoursesPg', function(req, res) {
    console.log('page number : ' + req.body.page); 
    console.log('per page : ' + req.body.perPage);
    var pageNo = req.body.page ; // parseInt(req.query.pageNo)
    var size = req.body.perPage;
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = parseInt(size)
    // Find some documents
    Courses.find({}, {}, query, function (err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = { "error": true, "message": "Error fetching data" };
        } else {
            response = { "error": false, "message": data };
        }
        res.json(response);
    });
});
// /////////////////////////// get course by city
router.get("/ListByCity/:id", (req, res) => {
    let cityName;
    Cities.findOne({_id:req.params.id}).select('name -_id').then((city)=>{
        console.log(city);
        
            cityName= city.name
            console.log(cityName);
            
         Courses.find({type: { '$regex' :cityName , '$options' : 'i' }}).then((courses)=>{
             console.log(courses);
             
        res.status(201).json(courses) 
    }).catch(err => {
        console.log(err);
        res.status(500).json({
        message: 'oooops something went wrong with courses'
        });
        })
    })
})


// /////////////////////////// get course by branch
router.get("/ListByBranch/:id", (req, res) => {
    var selectedBranch;
    branches.findOne({_id:req.params.id}).select('name -_id').then(branch=>{
        selectedBranch=branch.name
        console.log(selectedBranch)
    }).then(()=>{
        Courses.findOne({type: { '$regex' : selectedBranch, '$options' : 'i' }}).select('name -_id')
        .then(courses=>{
                console.log("you got "+courses.length+" courses in this branch")
                res.status(201).json(courses)   
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                message: 'oooops something went wrong with courses'
                });
            })
    })  
})

// /////////////////////////// get online courses
router.get("/online", (req, res ) => {
        Courses.find({type:'online'}).populate({path:'category',select:'name -_id'})
        .then(courses=>{
                console.log("you got "+courses.length+" courses online")
                res.status(201).json(courses)   
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                message: 'oooops something went wrong with courses'
                });
            })
      
})

// /////////////////////////// get offline courses
router.get("/offline", (req, res ) => {
    Courses.find({type: { $ne:'online' }}).populate({path:'category',select:'name -_id'})
    .then(courses=>{
            console.log("you got "+courses.length+" courses offline")
            res.status(201).json(courses)   
        }).catch(err => {
            console.log(err);
            res.status(500).json({
            message: 'oooops something went wrong with courses'
            });
        })
//   
})

// get course by categeryiD
router.post("/getCoursesByCategoryId", (req, res) => {
     let categoryId =req.body.id
    Courses.find({category : categoryId}).populate({path:'categories',select:'name -_id'})
    .then(categories=>{
        console.log(categories);
        res.status(200).json(categories);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
        message: 'NotDataFound'
        });
    })
})

// Route to update course [courses collection]
router.post('/updateCourse', function(req,res){remote 
    var request_data = req.body;
    console.log(request_data);
    var courseModel = new Courses(request_data);
    var courseData = courseModel.toObject();
    delete courseData._id;

    var currentCourseId;
    if (request_data._id || request_data._id !== '') {
        currentCourseId = new mongoose.mongo.ObjectId(request_data._id);
    } else {
        currentCourseId = new mongoose.mongo.ObjectId();
    }
    Courses.updateOne({_id: currentCourseId}, courseData, {upsert: true},
        function(err, result) {
           return res.status(200).json(result);
          })
  


});

// Route to get course by id [courses collection]
router.post('/getCourseById', function(req, res, next) {
    CourseId = req.body.id;
    Courses.findById({_id:CourseId}, function(err, course){
    console.log(course);
     res.json({
      status:{
       code:0,
       msg:'sucess'
      },
      data:course
     });
    }); 
});


// /////////////////////////// get highest learners num. in courses
router.get("/highestLearners", (req, res) => {
    Courses.aggregate([{ $unwind: "$learners" },
    { $group : { _id : "$name", numOfStudent : { $sum : 1 } } }])
    .then(courses=>{
        let maxCourseNumOfLearners=courses.reduce(function(prev, current) {
            return (prev.numOfStudent > current.numOfStudent) ? prev : current 
        })
        console.log(maxCourseNumOfLearners)
        let highestCourseName=maxCourseNumOfLearners._id;
        let highestNumOfLearners=maxCourseNumOfLearners.numOfStudent;
        res.status(201).json(highestNumOfLearners)   
    }).catch(err => {
        console.log(err);
        res.status(500).json({
        message: 'oooops something went wrong with courses'
        });
    })
})

// Route to get course's reviews by id "visibility=true only" [courses collection]
router.post('/getAllCourseReviewes', function(req, res, next) {
    coursId = req.body.id
    Courses.findOne({_id:coursId}).populate({path:'reviews'})
        .then(course=>{
        let reviews = course.reviews.filter(r=>{
            return r.visibility == true
        })
             res.status(200).json(reviews)  
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                message: 'NoDataFound'
                });
            })
});


// /////////////////////////// Enroll to a course
router.get("/enroll", (req, res) => {
    let {studentId , courseId}=req.query
    
    students.findOne({ _id:studentId}).then((student)=>{
    const isCourseThere=student.courses.includes(courseId)
    console.log(student+'>>>'+isCourseThere);
    if(isCourseThere) res.status(500).json('you had enrolled to this already')
        else {
            Courses.findOne({ _id:courseId}).then(course=>{
                    const isStudentErnolled=course.learners.includes(studentId)
                console.log(isStudentErnolled+'---');
                if (isStudentErnolled) res.status(500).json('you had enrolled to this already')
                else
            students.findOneAndUpdate({ _id:studentId},
                { "$push": {
                    "courses": courseId
                }},{new: true ,useFindAndModify: false}
            ).then(()=>{
                Courses.findOneAndUpdate({ _id:courseId},
                { "$push": {
                    "learners": studentId
                }},{new: true ,useFindAndModify: false}
                ).then(()=>{
                    res.status(500).json('enroll done')
                })
                
            })
            
            })
        }
    }).catch(err => {
                console.log(err);
                res.status(500).json({
                message: 'NoDataFound'
                });
            })
})

router.get("/enrol", (req, res) => {
    let {studentId , courseId}=req.query
    const updateStudent=students.findOneAndUpdate({ _id:studentId},
        { "$push": {
            "courses": courseId
        }},{new: true ,useFindAndModify: false}
    )
    const updateCourse= Courses.findOneAndUpdate({ _id:courseId},
        { "$push": {
            "learners": studentId
        }},{new: true ,useFindAndModify: false}
        )
    Promise.all([updateStudent,updateCourse]).then(result=>{
        console.log(result);
        
        res.status(500).json('enroll done')
    }).catch(err => {
                console.log(err);
                res.status(500).json({
                message: 'NoDataFound'
                });
            })
    
        
})
/* router.get("/enrol", (req, res) => {
    let {studentId , courseId}=req.query
    Courses.findOne({ _id:courseId}).then(course=>{
        const isStudentErnolled=course.learners.includes(studentId)
    console.log(isStudentErnolled+' -st');
    if (isStudentErnolled) res.status(500).json('you had enrolled to this already')
    else {
        students.findOne({_id:studentId}).then(student=>{
            const isStudentErnolled=student.courses.includes(courseId)
            if (isStudentErnolled) res.status(500).json('you had enrolled to this already')
            else {
            const updateStudent=students.findOneAndUpdate({ _id:studentId},
                { "$push": {
                    "courses": courseId
                }},{new: true ,useFindAndModify: false}
            )
            const updateCourse= Courses.findOneAndUpdate({ _id:courseId},
                { "$push": {
                    "learners": studentId
                }},{new: true ,useFindAndModify: false}
                )
            Promise.all([updateStudent,updateCourse]).then(result=>{
                console.log(result);
                
                res.status(500).json('enroll done')
            }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                        message: 'NoDataFound'
                        });
                    })
                }
        })
    }
    })   
    
        
}) */
module.exports = router;

