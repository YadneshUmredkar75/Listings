const mongoose = require("mongoose");




const listall = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: { type: String, required: true, default: "default_filename" },
        url: { type: String, default: "https://photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg" },
    },
    
    price: Number,
    location: String,
    country: String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }]
});
const Listing = mongoose.model("Listing", listall);
module.exports = Listing;


