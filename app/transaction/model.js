const mongoose = require('mongoose');

let transactionSchema = mongoose.Schema({
    historyVoucherTopup: {
        gameName: { type: String, require: [true, 'Game Name required'] },
        category: { type: String, require: [true, 'Category required'] },
        thumbnail: { type: String },
        coinName: { type: String, require: [true, 'Coin Name required'] },
        coinQuantity: { type: String, require: [true, 'Coin Quantity required'] },
        price: { type: Number }
    },
    historyPayment: {
        name: { type: String, require: [true, 'Name required'] },
        type: { type: String, require: [true, 'Type required'] },
        bankName: { type: String, require: [true, 'Bank Name required'] },
        accountNumber: { type: String, require: [true, 'Account Number required'] },
    },
    name: {
        type: String,
        require: [true, 'Name required!'],
        maxlength: [250, 'Name must be between 9-250 character!'],
        minlength: [9, 'Name must be between 9-250 character!']
    },
    accountUser: {
        type: String,
        require: [true, 'Account User required!'],
        maxlength: [250, 'Account User must be between 9-250 character!'],
        minlength: [9, 'Account User must be between 9-250 character!']
    },
    tax: {
        type: Number,
        default: 0
    },
    value: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    },
    histoyUser: {
        name: { type: String, require: [true, 'Player Name Game required'] },
        phoneNumber: {
            type: String,
            require: [true, 'Phone Number required!'],
            maxlength: [13, 'Phone Number must be between 9-13 character!'],
            minlength: [9, 'Phone Number must be between 9-13 character!']
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);