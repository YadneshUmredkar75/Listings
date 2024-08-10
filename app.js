const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
// const wrapAsync = require("./utils/async.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listall,reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const flash =require("connect-flash");
const passport=require("passport");
const Localpassport=require("passport-local-mongoose");
const User = require("./models/user.js");

const sessionop={
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
   
  };
  

const listing=require("./routes/listings.js");
const reviews=require("./routes/reviews.js")

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
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});
app.use(session(sessionop));
  app.use(flash());
  //User Authenication / Authorization======>
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new Localpassport(User.authenticate));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.get("/user",async(req,res)=>{
        let user =new User({
            email:"student@gmail",
            username:"user1",
        });
  let Us=await User.register(user,"Password");
  res.send(Us);
    })

app.use("/listing",listing); 
app.use("/listing/:id/reviews",reviews); 



   


app.listen(8080,()=>{
    console.log("derver was listening port 8080");
});





