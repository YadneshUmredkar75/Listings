const Joi = require('joi');

module.exports.shema = Joi.object({
    listing:Joi.object({
    title:Joi.string().required(),
    discripition:Joi.string().required(),
    price:Joi.number().required(),
    location:Joi.string().required(),
    country:Joi.string().required(),
    image:Joi.string().allow("",null),
}).required()
})
module.exports.reviewSchema= Joi.object({
   review:Joi.object({
    reatings:Joi.number().required().min(1).max(5),
    comment:Joi.string().required(),
   }).required,
