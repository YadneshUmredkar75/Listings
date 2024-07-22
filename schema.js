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