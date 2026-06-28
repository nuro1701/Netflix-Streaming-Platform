const tokenController = require('../controllers/token');

const express = require('express');
const router = express.Router();

router.route('/')
    .post(tokenController.login)

module.exports = router;