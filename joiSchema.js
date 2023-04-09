const Joi = require("joi");
const joi =require("joi");
const ExpressError=require("./utils/ExpressError.js")

const validateCampground=(req,res,next)=>{
    const campgroundSchema=joi.object({
        campground:joi.object({
            title:joi.string().required(),
            price:joi.number().required().min(0),
            image:joi.string().required(),
            location:joi.string().required(),
            description:joi.string().required()
        }).required()
    })
    const {error}=campgroundSchema.validate(req.body)
    if (error){
        const msg=error.details.map(el=>el.message).join(",")
        throw new ExpressError(msg,400)
    }

}
const validateReview=(req,res,next)=>{
    const reviewJOISchema=Joi.object({
        reviews:Joi.object({
            rating:Joi.number().required().min(1).max(5),
            body:Joi.string().required()
        }).required()
    })
    const {error}=reviewJOISchema.validate(req.body)
    if (error){
        const msg=error.details.map(el=>el.message).join(",")
        throw new ExpressError(msg,400)
    }
    
}

module.exports={
    validateCampground:validateCampground,
    validateReview:validateReview
};