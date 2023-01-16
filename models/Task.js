const {Schema,model} = require("mongoose");
const TaskSchema = new Schema({
    owner: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    content : {
        type : String,
        required: true
    }
})
const Task = model('Task',TaskSchema);
module.exports = Task;