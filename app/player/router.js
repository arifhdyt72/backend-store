var express = require('express');
var router = express.Router();

const multer = require('multer');
const os = require('os');

const { index, create, actionCreate, actionEdit, actionUpdate, actionDelete, actionStatus } = require('./controller');
const { isLoginAdmin } = require('../middleware/auth');

router.use(isLoginAdmin);
/* GET home page. */
router.get('/', index);
router.get('/create', create);
router.post('/create', multer({ dest: os.tmpdir()}).single('avatar'), actionCreate);
router.get('/edit/:id', actionEdit);
router.put('/update/:id', multer({ dest: os.tmpdir()}).single('avatar'), actionUpdate);
router.delete('/delete/:id', actionDelete);
router.put('/status/:id', actionStatus);

module.exports = router;