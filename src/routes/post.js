"use strict";

const express        = require('express');
const router         = express.Router();
const multer = require("multer");
const upload = multer({dest: "public/images/postsGallery"});
const type = upload.array("photos");
const middlewares    = require('../middlewares');
const PostController = require('../controllers/post');

router.post('/create', middlewares.checkAuthentication, type, PostController.create);
router.get('/view:id', middlewares.checkAuthentication, PostController.ViewPostDetails);
router.put('/update:id', middlewares.checkAuthentication, type, PostController.update);
router.delete('/delete:id', middlewares.checkAuthentication, PostController.remove);
router.get('/view/all:id', middlewares.checkAuthentication, PostController.ViewAll);

module.exports = router