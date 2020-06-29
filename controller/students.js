const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Students = require("../models/students");

router.post('/register', (req, res) => {
    const today = new Date();
    const studentData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        created: today
    }
    Students.findOne({
        email: req.body.email
    })
    .then(student => {
        if(!student){
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                studentData.password = hash
                Students.create(studentData)
                .then(student => {
                    res.json({status: student.email + ' registered!'})
                })
                .catch(err => {
                    res.send('error: ' + err)
                })
            })
        } else {
            res.json({error: ' student already exists'})
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})




module.exports = router;