const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const { verifyAccessToken } = require('./helpers/jwt_helper');
require('dotenv').config();
require('./helpers/init_mongodb');
require('./helpers/init_redis');


const authRoute = require('./routes/auth.route');
const chatRoute = require('')

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', verifyAccessToken, async(req, res, next) => {
    console.log(req.headers['authorization']);

    res.send("Hello from express");
});

app.use('/auth', authRoute);
app.use('/chat', )

app.use(async (req, res, next) => {
    next(createError.NotFound());
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.send({
        error: {
            status: error.status || 500,
            message: error.message
        }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});