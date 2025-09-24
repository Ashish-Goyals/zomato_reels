const express = require ('express');
const foodModel = require ('../models/food.model');
const storageService = require ('../services/storage.service');
const {v4: uuid} = require ('uuid');

module.exports.createFoodItem = async (req, res) => {
  try {
    const fileUploadResult = await storageService.uploadFile (
      req.file.buffer,
      uuid ()
    );

    // console.log ('File uploaded:', fileUploadResult);

    const foodItem = await foodModel.create ({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id,
    });

    res.status (201).json ({
      message: 'Food created successfully',
      file: fileUploadResult,
      food: foodItem,
    });
  } catch (error) {
    console.error (error);
    res.status (500).json ({error: error.message});
  }
};

module.exports.getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await foodModel
      .find ()
      .populate ('foodPartner', 'name email');
    res.status (200).json ({foodItems});
  } catch (error) {
    console.error (error);
    res.status (500).json ({error: error.message});
  }
};
