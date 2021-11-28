const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const client = require('./init_redis');



module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            console.log('signAccessToken called');
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: '1m',
                issuer: 'test.com',
                audience: userId
            };
            JWT.sign(payload, secret, options, (err, token) => {
                console.log('JWT Sign' + " err:" + err + " token:" + token);
                if (err) {
                    console.log(err);
                    reject(createError.InternalServerError());
                }
                console.log(token);
                resolve(token);
            });
        });
    },

    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized())

        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
            if (error){ 
                const msg = error.name == 'JsonWebTokenError' ? 'Unauthorized' : error.message;
                return next(createError.Unauthorized(msg));
            }

            req.payload = payload;
            next();
        });
    },

    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            console.log('signRefreshToken called');
            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                issuer: 'test.com',
                audience: userId
            };
            JWT.sign(payload, secret, options, (err, token) => {
                console.log('JWT Sign' + " err:" + err + " token:" + token);
                if (err) {
                    console.log(err);
                    reject(createError.InternalServerError());
                }
                console.log(token);
                client.SET(userId, token, 'EX', 365*24*3600, (error, reply) => {
                    if (error) {
                        console.log(error.message);
                        return reject(createError.InternalServerError());
                    }
                    resolve(token);
                });
            });
        });
    },

    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) return reject(createError.Unauthorized())

                const userId = payload.aud;
                client.GET(userId, (error, result) => {
                    if (error) {
                        console.log(error.message);
                        return reject(createError.InternalServerError())
                    }
                    if (refreshToken === result) 
                        resolve(userId);
                    else
                        return reject(createError.Unauthorized());
                });
            })
        });
    }
}