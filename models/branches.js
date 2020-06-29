const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const branchSchema=new Schema({ 
    name:{
        type: String,
        required:true
    },
     yearStarted:{
        type:Number,
        required:true
    },
    cities:[{
        type: Schema.Types.ObjectId,
        ref:'city'
    }]
});


module.exports=mongoose.model('branch',branchSchema); 