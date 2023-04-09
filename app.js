////REQUIRING EXPRESS 
const express =require("express")
const app=express()

/////REQUIRING PATH
const path=require("path");

////REQUIRING METHOD-OVERRIDE
const methodOverride=require("method-override")


////REQUIRING EJS-MATE FOR MAKING A COMMON TEMPLATE FOR ALL TEMPLATES
const ejs_mate =require("ejs-mate");
app.engine("ejs",ejs_mate)

////REQUIRING THE ERROR CLASS
const ExpressError=require("./utils/ExpressError.js")

////REQUIRING JOI FOR HANDLING ERRORS RELATED TO MONGOOSE OR SCHEMA
const joi=require("joi");

////REQUIRING THE REVIEWS MODEL
const Review=require("./models/reviews")

////CONNECTING WITH THE MONGO USING MONGOOSE
const Campground=require("./models/campground.js") //model
const mongoose=require("mongoose");
const res = require("express/lib/response");
const { findById } = require("./models/campground.js");
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(()=>{
        console.log("mongo connection open")    
    })
    .catch(err=>{
        console.log("mongo eror")
    })

/////////////////////////////    
////SETTING UP VIEWS AND EJS
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));

/////////////
////JOI MIDDLEWARE FUNCTION
const {validateCampground,validateReview}=require("./joiSchema.js")
//const validateCampground=(req,res,next)=>{
//     const campgroundSchema=joi.object({
//         campground:joi.object({
//             title:joi.string().required(),
//             price:joi.number().required().min(0),
//             image:joi.string().required(),
//             location:joi.string().required(),
//             description:joi.string().required()
//         }).required()
//     })
//     const {error}=campgroundSchema.validate(req.body)
//     if (error){
//         const msg=error.details.map(el=>el.message).join(",")
//         throw new ExpressError(msg,400)
//     }

// }



////////////////////////////////////////////////////
////////SETTING UP ROUTES
//HOME PAGE
app.get("/",(req,res)=>{
    //res.send("hello from yelp camp")
    res.render("home.ejs")
})


////
//MODEL ROUTE/HOME ROUTE
app.get("/campgrounds",async(req,res,next)=>{
    try {
        // const camp=new Campground({  //setting up an new instance of a model
    //     title:"My Backyard",
    //     price:"60",
    //     description:"just an example",
    //     location:"NYC"
    // })
    //await camp.save();

    const campgrounds=await Campground.find({});
    res.render("campgrounds/index.ejs",{campgrounds:campgrounds})
    //res.send(camp);    
    } catch (error) {
        next(error);
    }
    
})


////
//NEW CAMPGROUND ROUTE
app.get("/campgrounds/new",(req,res) =>{
    res.render("campgrounds/new.ejs")
})

app.post("/campgrounds",async(req,res,next)=>{
    try {
        //if(!req.body.campground) throw( new ExpressError("Invalid Campground Data",400));
        //res.redirect("campgrounds/index.ejs")
        validateCampground(req,res,next)
        const campground=new Campground(req.body.campground);
        await campground.save();
        res.redirect(`campgrounds/${campground._id}`)

    } catch (error) {
        next(error)    
    }
    
})


////
//SHOW ROUTE
app.get("/campgrounds/:id",async(req,res,next)=>{
    try {
        const campground=await Campground.findById(req.params.id).populate("reviews")
        //console.log(campground);
        res.render("campgrounds/show.ejs",{campground:campground})    
    } catch (error) {
        next(error);
    }
    
})



////
//UPDATING CAMPGROUNDS ROUTE
app.get("/campgrounds/:id/edit",async(req,res,next)=>{
    try {
        const campground=await Campground.findById(req.params.id)
        res.render("campgrounds/edit",{campground:campground})    
    } catch (error) {
        next(error)
    }
    
})


app.put("/campgrounds/:id",async(req,res,next)=>{
    try {
        const {id}=req.params;
        const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
        res.redirect(`/campgrounds/${campground._id}`)    
    } catch (error) {
        next(error)
    }
    
})


//DELETE CAMPGROUND ROUTE
app.delete("/campgrounds/:id",async(req,res,next)=>{
    try {
        const{id}=req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect(`/campgrounds`);    
    } catch (error) {
        next(error)
    }
    
})


////////////////
//ROUTES FOR REVIEW
//POSTING REVIEWS ROUTE
app.post("/campgrounds/:id/reviews",async(req,res,next)=>{
    try {
        validateReview(req,res,next)
        const campground=await Campground.findById(req.params.id)
        const review_form=req.body.reviews
        //console.log(review_form)
        const review=new Review(review_form)
        //console.log(review.body)
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)    
    } catch (error) {
        next(error)
    }
    
})

//DELETE REVIEW ROUTE
app.delete("/campgrounds/:id/reviews/:reviewId",async (req,res,next)=>{
    try {
        const {id,reviewId}=req.params;
        await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/campgrounds/${id}`)
        //res.send("deleted")
    } catch (error) {
        next(error)
    }
})



///////
//////
////SETTING UP A 404
app.all("*",(req,res,next)=>{
    next(new ExpressError("Page Not Found",404))
})


//////////////////////////////
////ERROR HANDLING
//INVALID INPUT
app.use((err,req,res,next)=>{
    const {message="Something Went Wrong",status=500}=err;
    res.status(status).render("error.ejs",{err})
})


//////////////////////////////
app.listen(3000,()=>{
    console.log("serving on port 3000")
})