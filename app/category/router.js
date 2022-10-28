var express = require('express');
var router = express.Router();

const { index, create, actionCreate } = require('./controller');

/* GET home page. */
router.get('/', index);
router.get('/create', create);
router.post('/create', actionCreate);

module.exports = router;