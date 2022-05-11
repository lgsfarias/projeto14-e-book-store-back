import joi from "joi";

export async function validateSignUp (req, res, next) {

    //TODO: melhorar a validação da senha
    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required()
    });
    const validation = userSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        res.status(422).send(validation.error.details.map(detail => detail.message));
        return;
    }
    next();
}

export async function validateSignIn (req, res, next) {

    const userSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });
    const validation = userSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        res.status(422).send(validation.error.details.map(detail => detail.message));
        return;
    }
    next();
}