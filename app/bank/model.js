const mongoose = require('mongoose');

let bankSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Name not be empty!']
    },
    bankName: {
        type: String,
        require: [true, 'Bank Name not be empty!']
    },
    accountNumber: {
        type: String,
        require: [true, 'Bank Name not be empty!']
    }
});

module.exports = mongoose.model('Bank', bankSchema);