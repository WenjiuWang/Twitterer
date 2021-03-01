const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'from'
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: "to"
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
