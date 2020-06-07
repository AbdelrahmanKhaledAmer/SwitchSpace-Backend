"use strict";

const express        = require('express');
const router         = express.Router();

const middlewares    = require('../middlewares');
const PostController = require('../controllers/post');

router.post('/post/create',middlewares.checkAuthentication ,PostController.create);
router.get('/post/view:id', middlewares.checkAuthentication, PostController.ViewPostDetails);
router.put('/post/update:id',middlewares.checkAuthentication ,PostController.update);
router.delete('post/delete:id', middlewares.checkAuthentication,PostController.remove);
router.get('/post/view/all:id',middlewares.checkAuthentication,PostController.ViewAll);