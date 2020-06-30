const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const courseSchema=new Schema({ 
    name:{ type: String, required:true },
    video:{ type: String  },
    description:{ type: String },
    price:{ type: Number },
    syllabus:{ type: [String] },
    aboutProgram:{ type: String },
    type:{ type: String },
    skillLevel:{ type: String },
    startingDate:{ type: String },
    endingDate:{ type: String },
    duration:{ type: String },
    trainers:{ type: [String] },
    category:{ type: Schema.Types.ObjectId, ref:'category'},
    learners:[{ type: Schema.Types.ObjectId, ref:'student'}],
    reviews:[{ type: Schema.Types.ObjectId, ref:'review'}]
});


module.exports=mongoose.model('course',courseSchema); 



