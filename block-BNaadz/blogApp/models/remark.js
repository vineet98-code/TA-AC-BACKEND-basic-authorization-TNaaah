const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var remarkSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  articleId: { type: Schema.Types.ObjectId, ref: 'article', required: true },
  likes: { type: Number, default: 0},
  dislikes: { type: Number, default: 0},

}, { timestamps: true });

module.exports = mongoose.model('Remark', remarkSchema);