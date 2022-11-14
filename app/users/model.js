const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    email: {
        type: String,
        require: [true, 'Email not be empty!!']
    },
    name: {
        type: String,
        require: [true, 'Name not be empty!!']
    },
    password: {
        type: String,
        require: [true, 'Password not be empty!!']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin'
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    phoneNumber: {
        type: String,
        require: [true, 'Phone Number not be empty!!']
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);