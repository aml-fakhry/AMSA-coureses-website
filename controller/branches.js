const express = require("express");
const router = express.Router();

const branches = require("../models/branches");

router.post("/add", (req, res) => {
    
    const newBranch = new branches({
        name:req.body.name,
        yearStarted:req.body.yearStarted,
        cities:req.body.cities
    })
    
    newBranch.save().then(result=>{
        console.log(result);
        res.status(201).json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
        message: 'oooops something went wrong with the new branch'
        });
    })
})

router.get("/citiesOfBrunch/:id", (req, res) => {
    branches.findOne({_id:req.params.id},).select('cities -_id').populate({path:'cities',select:'name -_id'})
    .then(cities=>{
        console.log(cities);
        res.status(201).json(cities);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
        message: 'oooops something went wrong with the branch'
        });
    })
})

// Route to get all branches [branches collection]

router.get("/allBranches", (req, res) => {
    branches.find({}, function(err, data){
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
router.post('/allBranchesPg', function(req, res) {
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
    branches.find({}, {}, query, function (err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = { "error": true, "message": "Error fetching data" };
        } else {
            response = { "error": false, "message": data };
        }
        res.json(response);
    });
});


module.exports = router;