import foodModel from "../models/foodModel.js";
import fs from "fs";

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({
      success: false,
      message: "Price must be a valid positive number.",
    });
  }

  try {
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    await food.save();
    res.status(201).json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while adding the food item. Please try again later.",
    });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching food items. Please try again later.",
    });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found.",
      });
    }

    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
        return res.status(500).json({
          success: false,
          message: "Error deleting the image file. Please try again later.",
        });
      }
    });

    await foodModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error("Error removing food item:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while removing the food item. Please try again later.",
    });
  }
};

export { addFood, listFood, removeFood };
