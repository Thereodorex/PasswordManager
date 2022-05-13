const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScheme = new Schema({
    id: Number,
    login: String,
    password: String
}, {versionKey: false});

const User = mongoose.model("User", userScheme);

module.exports = User;