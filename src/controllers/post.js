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
        let post = PostModel.findById(req.params.id).exec();

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






module.exports = {
    create,
    ViewPostDetails
};