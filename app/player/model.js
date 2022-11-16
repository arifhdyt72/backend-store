const mongoose = require('mongoose');

let playerSchema = mongoose.Schema({
    email: {
        type: String,
        require: [true, 'Email not be empty!!'],
        maxlength: [255, 'Email must be between 3-255 character!'],
        minlength: [3, 'Email must be between 3-255 character!']
    },
    name: {
        type: String,
        require: [true, 'Name not be empty!!'],
        maxlength: [255, 'Name must be between 3-255 character!'],
        minlength: [3, 'Name must be between 3-255 character!']
    },
    username: {
        type: String,
        require: [true, 'Username not be empty!!'],
        maxlength: [255, 'Username must be between 3-255 character!'],
        minlength: [3, 'Username must be between 3-255 character!']
    },
    password: {
        type: String,
        require: [true, 'Password not be empty!!']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    avatar: {
        type: String
    },
    fieldName: {
        type: String
    },
    phoneNumber: {
        type: String,
        require: [true, 'Phone Number not be empty!!'],
        maxlength: [13, 'Phone Number must be between 9-13 character!'],
        minlength: [9, 'Phone Number must be between 9-13 character!']
    },
    favorite: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }]
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);