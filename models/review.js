const { typo } = require("joi");
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment:String,
    reatings:{
        type:Number,
        min:1,
        max:5
    },
    createAt:{
        type:Date,
        default:Date.now()
    }
})
module.exports=mongoose.model("Review",reviewSchema);