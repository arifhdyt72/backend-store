var express = require('express');
var router = express.Router();

const multer = require('multer');
const os = require('os');

const { landingPage, detailPage, category, checkout, history, dashboard, profile, editProfile } = require('./controller');
const { isLoginPlayer } = require('../middleware/auth');

/* GET home page. */
router.get('/landing-page', landingPage);
router.get('/landing-page/:id/detail', detailPage);
router.get('/category', category);
router.post('/checkout', isLoginPlayer, checkout);
router.get('/history', isLoginPlayer, history);
router.get('/dashboard', isLoginPlayer, dashboard);
router.get('/profile', isLoginPlayer, profile);
router.put('/profile',
    isLoginPlayer,
    multer({ dest: os.tmpdir()}).single('avatar'),
    editProfile
);

module.exports = router;