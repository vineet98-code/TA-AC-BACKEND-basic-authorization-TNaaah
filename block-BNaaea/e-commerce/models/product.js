var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    name : { type: String, required: true },
    quantity : { type: Number, required: true },
    price :{ type: String, require: true },
    image: { type: String, require: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0},
    category: { type: [String], required: true },

    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    // Any time we store ObjectId of any other document, which belongs to some other models, we are going to use Schema.Types.ObjectId
 
    remark : [{ type: Schema.Types.ObjectId, ref: 'Remark' }],
        // whatever objectId is store here belongs to which model
}, {timestamps: true });

// This Book is used to perform the crud operation and capture it in router book.js
module.exports = mongoose.model('Product', productSchema); // model is equivalent to colletions