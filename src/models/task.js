const mongoose = require('mongoose');

taskSchema = new mongoose.Schema({
    description:{
        type: String,
        trim: true
    },
    completed:{
        type: Boolean
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})
const Task = mongoose.model('Task',taskSchema)  

module.exports = Task;