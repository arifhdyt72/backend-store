var express = require('express');
var router = express.Router();

const multer = require('multer');
const os = require('os');

const { signup, signIn } = require('./controller');

/* GET home page. */
router.post('/signup', multer({ dest: os.tmpdir()}).single('avatar'), signup);
router.post('/signin', signIn);

module.exports = router;