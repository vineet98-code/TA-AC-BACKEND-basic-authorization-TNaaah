var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title : { type: String, required: true },
    description :{ type: String },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0},

    tags: [String],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    // Any time we store ObjectId of any other document, which belongs to some other models, we are going to use Schema.Types.ObjectId
 
    remark : [{ type: Schema.Types.ObjectId, ref: 'Remark' }],
        // whatever objectId is store here belongs to which model

}, {timestamps: true });


// This Book is used to perform the crud operation and capture it in router book.js
module.exports = mongoose.model('Article', articleSchema); // model is equivalent to colletions