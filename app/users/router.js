var express = require('express');
var router = express.Router();

const { index, actionSignin, actionSignOut } = require('./controller');

/* GET home page. */
router.get('/', index);
router.post('/', actionSignin);
router.get('/logout', actionSignOut);

module.exports = router;