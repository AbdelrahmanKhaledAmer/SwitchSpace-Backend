"use strict";


const multer = require("multer");
const upload = multer({dest: "public/images/postsGallery"});
const type = upload.array("photos");
const fs = require('fs');
const ItemModel = require("../models/schema/item");
const PostModel = require("../models/schema/post");
const PostValidator = require("../models/validations/post")

// ********************************************************************************************************* //

// cretae a post
const create = async (req, res) => {
    // validate the post form
    const validationVerdict = PostValidator.validate(req.body);
    // check whether the form is incomplete
    if(validationVerdict.error) {
        console.log(validationVerdict.error);
        res.status(400).json(validationVerdict.error.details);
        return;
    }

    // create post with its complete attributes
    try {
        let post = await PostModel.create(req.body);
        return res.status(201).json(post)
    } catch(err) {
      return res.status(500).json({
        error: 'Internal server error',
        message: err.message
      });
    }
};

// ********************************************************************************************************* //

// view a specific post
const ViewPostDetails = async(req, res) => {
    try {
        let post = await PostModel.findById(req.headers.id).exec();

        if (!post) return res.status(404).json({
            error: 'Not Found',
            message: `Post not found`
          });
        
        return res.status(200).json(post)
    }
    catch(err) {
    return res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });

    }
};

// ********************************************************************************************************* //

// update a post
const update = async(req, res) => {
    // validate post form
    const validationVerdict = PostValidator.validate(req.body);
    // check whether the form is incomplete
    if(validationVerdict.error) {
        console.log(validationVerdict.error);
        res.status(400).json(validationVerdict.error.details);
        return;
    }
    
    try {
        let post = await PostModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).exec();
        return res.status.status(200).json(post)
    }

    catch(err){
    return res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });

    }

};

// ********************************************************************************************************* //

// delete a post
const remove = async(req, res) => {
    try{
    await PostModel.findByIdAndRemove(req.params.id).exec();
    return res.status(200).json({message: 'Post with id${req.params.id} was deleted'});
    }
    catch(err){
    return res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });

    }

};

const ViewAll = async(req, res) =>{
    try {
        posts = await PostModel.find({'creatorID':req.params.id}).exec();
        if (!posts) return res.status(404).json({
            error: 'Not Found',
            message: `Post not found`
          });
        
        return res.status(200).json(posts)

    }
    catch(err){
    return res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });

    }
};

module.exports = {
    create,
    ViewPostDetails,
    update,
    remove,
    ViewAll
};