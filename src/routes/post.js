"use strict";

const express        = require('express');
const router         = express.Router();

const middlewares    = require('../middlewares');
const PostController = require('../controllers/post');

router.post('/post/create',middlewares.checkAuthentication ,PostController.create);
router.get('/post/view', middlewares.checkAuthentication, PostController.ViewPostDetails);
