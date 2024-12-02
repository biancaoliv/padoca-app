import foodModel from "../foodModel";
import mongoose from "mongoose";

beforeAll(async () => {
  const mongoURL = "mongodb://127.0.0.1/food_test_db";
  await mongoose.connect(mongoURL);
});


afterAll(async () => {
  await mongoose.connection.close(); 
});

describe("Food model test", () => {
  let foodId;

  test("Should create and save a food item successfully", async () => {
    const foodData = {
      name: "Bread",
      description: "Delicious bread",
      price: 10.89,
      image: "bread.jpg",
      category: "Handmade",
    };

    const food = new foodModel(foodData);
    const savedFood = await food.save();

    expect(savedFood._id).toBeDefined();
    expect(savedFood.name).toBe(foodData.name);
    expect(savedFood.description).toBe(foodData.description);
    expect(savedFood.price).toBe(foodData.price);
    expect(savedFood.image).toBe(foodData.image);
    expect(savedFood.category).toBe(foodData.category);

    foodId = savedFood._id;
  });

  test("Should retrieve food item by ID", async () => {
    const foundFood = await foodModel.findById(foodId);

    expect(foundFood).toBeDefined();
    expect(foundFood._id.toString()).toBe(foodId.toString());
    expect(foundFood.name).toBe("Bread");
    expect(foundFood.description).toBe("Delicious bread");
    expect(foundFood.price).toBe(10.89);
    expect(foundFood.image).toBe("bread.jpg");
    expect(foundFood.category).toBe("Handmade");
  });

  test("Should fail when required fields are missing", async () => {
    const invalidFood = {};
    let error;

    try {
      const food = new foodModel(invalidFood);
      await food.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.description).toBeDefined();
    expect(error.errors.price).toBeDefined();
    expect(error.errors.image).toBeDefined();
    expect(error.errors.category).toBeDefined();
  });
  test("should save successfully when price is a valid number", async () => {
    const validPriceData = {
      name: "Pizza",
      description: "Cheese Pizza",
      price: 10,  
      image: "pizza.jpg",
      category: "Italian",
    };
  
    const food = new foodModel(validPriceData);
    const savedFood = await food.save();
  
    expect(savedFood).toBeDefined();
    expect(savedFood.price).toBe(10);
  });
});
