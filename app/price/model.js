const mongoose = require('mongoose');

let priceSchema = mongoose.Schema({
    coinQuantity: {
        type: Number,
        default: 0
    },
    coinName: {
        type: String,
        require: [true, 'Coin Name not be empty!!']
    },
    price: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Price', priceSchema);