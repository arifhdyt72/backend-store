const mongoose = require('mongoose');

let voucherSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "Name not be empty!!"]
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    thumbnail: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    prices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Voucher', voucherSchema);