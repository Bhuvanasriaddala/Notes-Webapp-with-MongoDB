const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/notesapp");

const noteSchema = {
    title:String,
    description:String
};


module.exports=mongoose.model('note',noteSchema);