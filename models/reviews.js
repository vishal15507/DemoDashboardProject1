const mongoose=require("mongoose")
const schema =mongoose.Schema;

const reviewSchema=new schema({
    body:String ,
    rating:Number
    
});

const Review=mongoose.model("Review",reviewSchema); //model
module.exports=Review