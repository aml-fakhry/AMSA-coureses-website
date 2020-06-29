const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const app = express();
const router = express.Router();

const branchesRoutes = require('./controller/branches')
const citiesRoutes = require('./controller/cities')
const coursesRoutes = require('./controller/courses')
const categoriesRoutes = require('./controller/categories')
const reviewsRoutes = require('./controller/reviews')
const studentsRoutes = require('./controller/students')

const MONGODB_URI='mongodb+srv://AMSA:AMSApassword@cluster0-y8dzc.mongodb.net/AMSAdb?retryWrites=true&w=majority'
mongoose.connect(
    MONGODB_URI,
     {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      }
     )
   .then(result =>{ 
     app.listen(8000,()=>{
      console.log("server & db connected");
     })
   } )
   .catch(err =>{
     console.log(err);
   });



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(router);
app.use("/public", express.static(path.join("public")));



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use('/branch', branchesRoutes)
app.use('/city', citiesRoutes)
app.use('/category', categoriesRoutes)
app.use('/course', coursesRoutes)
app.use('/api/review', reviewsRoutes)
app.use('/api/student', studentsRoutes)