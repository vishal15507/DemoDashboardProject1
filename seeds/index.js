const mongoose=require("mongoose")
const Campground=require("../models/campground.js");
const cities=require("./cities")
const {places,descriptors}=require("./seedHelper")
const pics=require("./pics")

mongoose.connect("mongodb://localhost:27017/yelp-camp")
    .then(()=>{
        console.log("mongo connection open")    
    })
    .catch(err=>{
        console.log("mongo eror")
    });


const sample=array=> array[Math.floor(Math.random() * array.length)];

//const db=mongoose.connection;
const seedDb=async()=>{
    await Campground.deleteMany({});
    for (let i=0;i<50;i++){
        const random50=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*50)
        const camp =new Campground({
            location:`${cities[random50].city},${cities[random50].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:pics[i],
            description: "lorem ipsum  gdjsakh dhbkhs hdsbkjh jhsdg hbsd chsh hbcd",
            price:price
        
        })
        await camp.save();
    }
    
}

seedDb();