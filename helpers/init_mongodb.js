const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${ process.env.MONGO_DB_USER }:${ process.env.MONGO_ATLAS_PASSWORD }@cluster0.nbo7o.mongodb.net/${ process.env.MONGO_DB_NAME }?retryWrites=true&w=majority`, 
        { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
        .then(() => {
            console.log('mongodb connected.');
        }).catch((err) => {
            console.log(err);
        });

mongoose.connection.on('connected', () => {
    console.log('mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
    console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('mongoose connection is disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});