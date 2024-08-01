const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapAsync = require("./utils/async.js");
const ExpressError = require("./utils/ExpressError.js");
const {schema} = require("./schema.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs',ejsmate );
 // | =========>>Middleware<<==========|


 app.use((err, req, res, next) => {
    const { status , message  } = err; 
    res.status(status).send(message);
});




main().then(res=>console.log("Connected DB"))
.catch(err=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/app");
}

app.get("/",(req,res)=>
    {res.send("server was working");});

//index form
app.get("/listing",async(req,res)=>{
   const allList=await Listing.find({});
   res.render("index.ejs",{allList} );

    
});
//create new list
app.get("/listing/new",(req,res)=>{
    res.render("create.ejs");
});

// validlate error
// let validationerror=(req,res,next)=>{
// const error=schema.validate(req.body);
       
//         if(error){
//             let erMsg = error.details.map((el)=>el.massage).join(",");
//             throw new ExpressError(400,erMsg)
//         }else{
//           next();
//         }
//     }

//show route
app.get("/listing/:id",async(req,res)=>{
    const {id}=req.params;
    const listlist=await Listing.findById(id);
    res.render("show.ejs",{listlist});
});
app.post("/listing",wrapAsync(async(req,res,next)=>{
        // const result=schema.validate(req.body);
        // console.log(result);
        // if(result.error){
        //     throw new ExpressError(400,result.error)
        // }
        
            const newListing = new Listing(req.body.listing);
            await newListing.save();
            res.redirect("/listing");
       
    
   
  
    
}));




//edit listing
app.get("/listing/:id/edit",async(req,res)=>{
    const {id}=req.params;
    const listlist=await Listing.findById(id);
    res.render("edit.ejs",{listlist});
});



// Update listings
app.put("/listing/:id",async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
  });



//Delete
app.delete("/listing/:id",async(req,res)=>{
    const {id}=req.params;
    const deletelist= await Listing.findByIdAndDelete(id);
    console.log(deletelist);
    res.redirect("/listing");
   

});

app.post("/listing/:id/review", wrapAsync(async (req, res, next) => {
    // const listlist = await Listing.findById(req.params.id);
    const listlist = await Listing.findById(req.params.id).populate('reviews');

    if (!listlist) throw new ExpressError(404, "Listing not found");
  
    let newReview = new Review(req.body.review);
   listlist.reviews.push(newReview);
    await newReview.save();
    await listlist.save();
  
    console.log("Review sent");
  
    res.redirect(`/listing/${listlist._id}`);
  }));


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
   })
   


app.listen(8080,()=>{
    console.log("derver was listening port 8080");
});


