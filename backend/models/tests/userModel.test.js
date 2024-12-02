import mongoose from "mongoose";
import userModel from "../userModel";

jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");
  const mockModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };

  return {
    ...actualMongoose,
    model: jest.fn((modelName) => {
      if (modelName === "user") {
        return mockModel;
      }
      throw new Error(`Model "${modelName}" not mocked!`);
    }),
    Schema: actualMongoose.Schema,
  };
});

describe("User Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should create a new user successfully", async () => {
    const userData = {
      name: "Bia Oliveira",
      email: "bia@teste.com",
      password: "hashedpassword",
      cartData: {},
    };

    const mockCreate = mongoose.model("user").create;
    mockCreate.mockResolvedValue(userData);

    const user = await userModel.create(userData);

    expect(mockCreate).toHaveBeenCalledWith(userData);
    expect(user).toEqual(userData);
  });

  test("Should fail when trying to create a user without the 'name' field", async () => {
    const userData = {
      email: "bia@teste.com",
      password: "hashedpassword",
      cartData: {},
    };
  
    const mockCreate = mongoose.model("user").create;
  
    const validationError = new mongoose.Error.ValidationError();
    validationError.addError('name', new mongoose.Error.ValidatorError({
      message: "name is required",
      path: 'name',
    }));
  
    mockCreate.mockRejectedValue(validationError);
  
    await expect(userModel.create(userData)).rejects.toThrow("Validation failed");
  
    await expect(userModel.create(userData)).rejects.toMatchObject({
      message: expect.stringContaining("Validation failed"),
      errors: {
        name: { message: "name is required" },
      },
    });
  });
  
  test("must find a user by email", async () => {
    const userEmail = "bia@teste.com";

    const mockUser = {
      name: "Bia",
      email: userEmail,
      password: "hashedpassword",
      cartData: {},
    };

    const mockFindOne = mongoose.model("user").findOne;
    mockFindOne.mockResolvedValue(mockUser);

    const user = await userModel.findOne({ email: userEmail });

    expect(mockFindOne).toHaveBeenCalledWith({ email: userEmail });
    expect(user).toEqual(mockUser);
  });
});
