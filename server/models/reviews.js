const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const reviewSchema=new Schema({ 
    reviewComment:{ type: String },
    reviewRate:{ type:Number},
    date: {type: Date, default: Date.now()} ,
    visibility:{type :Boolean, default: 'true'},
    student:{ type: Schema.Types.ObjectId , ref:'student'},
    course:{ type: Schema.Types.ObjectId , ref:'course'}
});


module.exports=mongoose.model('review',reviewSchema); 