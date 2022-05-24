const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const secretDataScheme = new Schema({
    id: Number,
    name: String,
    // dataTypeId: Number,
    userId: String,
    fields: [{
        name: String,
        value: String,
    }]
}, {versionKey: false});

const SecretData = mongoose.model("SecretData", secretDataScheme);

module.exports = SecretData;