"use strict";

const express        = require('express');
const router         = express.Router();
const multer = require("multer");
const upload = multer({dest: "public/images/postsGallery"});
const type = upload.array("photos");
const middlewares    = require('../middlewares');
const PostController = require('../controllers/post');

router.post('/create', middlewares.checkAuthentication, type, PostController.create);
router.get('/view', middlewares.checkAuthentication, PostController.ViewPostDetails);
router.put('/update', middlewares.checkAuthentication, type, PostController.update);
router.delete('/delete', middlewares.checkAuthentication, PostController.remove);
router.get('/view/all', middlewares.checkAuthentication, PostController.ViewAll);

/*
router.post('/create', type, PostController.create);
router.get('/view', PostController.ViewPostDetails);
router.put('/update', type, PostController.update);
router.delete('/delete', PostController.remove);
router.get('/view/all', PostController.ViewAll);
*/

module.exports = router