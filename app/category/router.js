var express = require('express');
var router = express.Router();

const { index, create, actionCreate, actionEdit, actionUpdate, actionDelete } = require('./controller');
const { isLoginAdmin } = require('../middleware/auth');

router.use(isLoginAdmin);
/* GET home page. */
router.get('/', index);
router.get('/create', create);
router.post('/create', actionCreate);
router.get('/edit/:id', actionEdit);
router.put('/update/:id', actionUpdate);
router.delete('/delete/:id', actionDelete);

module.exports = router;