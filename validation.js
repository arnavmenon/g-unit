const Joi=require('@hapi/joi');

const registerValidation = data =>{
    const schema= Joi.object({
        username:Joi.string().min(6).required(),
        password:Joi.string().min(8).required(),
        password2: Joi.string().valid(Joi.ref('password')).required(),
        email:Joi.string().required().email()
    });

    return schema.validate(data);
    
}

const loginValidation = data =>{
    const schema= Joi.object({
        username:Joi.string().min(6).required(),
        password:Joi.string().min(8).required(),

    });

    return schema.validate(data);
    
}

module.exports.registerValidation=registerValidation;
module.exports.loginValidation=loginValidation;