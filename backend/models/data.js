const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
   text: String
});

const Data = new mongoose.model("Data", dataSchema);

module.exports =  Data ;