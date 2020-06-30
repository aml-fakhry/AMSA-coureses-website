const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult} = require("express-validator");
const Students = require("../models/students");


router.post( "/register",
    [
        check("name", "Please Enter a Valid name")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            name,
            email,
            password
        } = req.body;
        try {
            let student = await Students.findOne({
                email
            });
            if (student) {
                return res.status(400).json({
                    msg: "student Already Exists"
                });
            }

            student = new Students({
                name,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            student.password = await bcrypt.hash(password, salt);

            await student.save();

            const payload = {
                student: {
                    id: student._id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);


router.post( "/login",
    [
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").isLength({
        min: 6
      })
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
  
      const { email, password } = req.body;
      try {
        let student = await Students.findOne({
          email
        });
        if (!student)
          return res.status(400).json({
            message: "student Not Exist"
          });
  
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch)
          return res.status(400).json({
            message: "Incorrect Password !"
          });
  
        const payload = {
            student: {
            id: student._id
          }
        };
  
        jwt.sign(
          payload,
          "randomString",
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token
            });
          }
        );
      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
    }
  );
  

  router.get("/allStudents", (req, res) => {
    Students.find({}, function(err, data){
        if(err){
            console.log(err);
            return
        }
        if(data.length == 0) {
            console.log("No record found")
            return
        }
        console.log(data);
        res.status(200).json(data);
    })
})
  

// all data Pagentiaed
router.post('/allStudentsPg', function(req, res) {
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
    Students.find({}, {}, query, function (err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = { "error": true, "message": "Error fetching data" };
        } else {
            response = { "error": false, "message": data };
        }
        res.json(response);
    });
});

// get byId
router.post("/getStudentById", (req, res) => {
    let studentId =req.body.id
    Students.find({_id : studentId}).populate({path:'courses',select:'name -_id'})
   .then(student=>{
       console.log(student);
       res.status(200).json(student);
   }).catch(err => {
       console.log(err);
       res.status(500).json({
       message: 'NotDataFound'
       });
   })
})


router.get("/getStudentByLasetYear", (req, res) => {
   
    Students.find({ "date": {$gt:new Date(Date.now() - 24*60*60 * 1000)}})
    .populate({path:'courses',select:'name -_id'})
   .then(student=>{
       console.log(student);
       res.status(200).json(student);
   }).catch(err => {
       console.log(err);
       res.status(500).json({
       message: 'NotDataFound'
       });
   })
})
module.exports = router;