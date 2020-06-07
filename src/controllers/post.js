"use strict";

const ItemModel = require('../models/item');
const PostModel = require('../models/post');


const create = async (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    try {
        let post = await PostModel.create(req.body);
    } catch(err) {
      return res.status(500).json({
        error: 'Internal server error',
        message: err.message
      });
    }
};

const ViewPostDetails = async(req, res) => {
    try {
        let post = await PostModel.findById(req.params.id).exec();

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

const update = async(req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });
    
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