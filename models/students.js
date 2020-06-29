const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const studentSchema=new Schema({ 
    name:{type: String },
    email:{ type:String ,require:true}, 
    password: {type: String, require: true},
    date: {type: Date, default: Date.now()} ,
    courses:{
        type:[{ type: Schema.Types.ObjectId, ref:'course'}]
    }
});


module.exports=mongoose.model('student',studentSchema); 