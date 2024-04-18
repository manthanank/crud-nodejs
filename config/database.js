// config/database.js
const mongoose = require('mongoose');

require('dotenv').config();

const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DBNAME || 'crud';

const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.re3ha3x.mongodb.net/${dbName}?retryWrites=true&w=majority`;

module.exports = async function connectDB() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true, useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed');
        console.error(error);
    }
};
