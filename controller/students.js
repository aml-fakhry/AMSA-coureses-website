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
  
  
module.exports = router;