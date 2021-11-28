const createError = require('http-errors');
const User = require('../models/user.model');
const { authSchema } = require('../helpers/validation_schema');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper');
const client = require('../helpers/init_redis');



module.exports = {
    register: async (req, res, next) => {
        try {
    
            const result = await authSchema.validateAsync(req.body);
    
            const doesExists = await User.findOne({email: result.email});
    
            if (doesExists) 
                throw createError.Conflict(`${result.email} is already been registered`);
    
            const userObj = new User(result);
            const savedUser = await userObj.save();
            console.log(savedUser);
            const accessToken = await signAccessToken(savedUser.id);
            const refreshToken = await signRefreshToken(savedUser.id);
    
            res.send({accessToken, refreshToken});
    
        } catch (error) {
            if (error.isJoi) 
                error.status = 422;
            next(error);
        }
        res.send("register route");
    },

    login: async (req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body);
            const user = await User.findOne({email: result.email});
            console.log(user);
    
            if (!user) {
                throw createError.NotFound('User not found');
            }
    
            const isMatch = await user.isValidPassword(result.password);
    
            if (!isMatch) {
                throw createError.Unauthorized('Username/password not valid');
            }
    
            const accessToken = await signAccessToken(user.id);
            const refreshToken = await signRefreshToken(user.id);
    
            res.send({accessToken, refreshToken});
        } catch (error) {
            if (error.isJoi) return next(createError.BadRequest('Invalid Username/Password'));
            next(error);
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            const {refreshToken} = req.body;
    
            if (!refreshToken)  throw next(createError.BadRequest());
    
            const userId = await verifyRefreshToken(refreshToken);
    
            const accessToken = await signAccessToken(userId);
            const newRefreshToken = await signRefreshToken(userId);
    
            res.send({accessToken, refreshToken: newRefreshToken});
    
        } catch (error) {
            next(error);
        }
    },

    logout: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) next(createError.BadRequest());
    
            const userId = await verifyRefreshToken(refreshToken);
    
            client.DEL(userId, (error, val) => {
                if (error) {
                    console.log(error.message);
                    throw createError.InternalServerError();
                }
                console.log(val);
            });
            res.sendStatus(204);
    
        } catch (error) {
            next(error);
        }
    }
};