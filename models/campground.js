const mongoose=require("mongoose")
const schema =mongoose.Schema;

const Review=require("./reviews.js")

const CampgroundSchema=new schema({
    title:String ,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[{
        type:schema.Types.ObjectId,
        ref:"Review"
    }]
});

CampgroundSchema.post("findOneAndDelete",async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:doc.reviews
        })
    }
})

const Campground=mongoose.model("Campground",CampgroundSchema); //model
module.exports=Campground