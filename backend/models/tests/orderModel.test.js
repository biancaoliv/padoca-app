import orderModel from "../orderModel";
import mongoose from "mongoose";

let Order;

beforeAll(async () => {
  const mongoURL = "mongodb://127.0.0.1/order_test_db";
  await mongoose.connect(mongoURL);
  Order = orderModel;
});

afterAll(async () => {
    await mongoose.connection.close();
  });

describe("Order model test", () => {
  test("Should create and save an order successfully", async () => {
    const orderData = {
      userId: "1",
      items: [{ productId: "25", quantity: 2 }],
      amount: 50,
      address: {
        street: "Test",
        number: 1,
        city: "City test",
        state: "state test",
        zipcode: "12348-548",
      },
      status: "Food Processing",
      payment: true,
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.userId).toBe(orderData.userId);
    expect(savedOrder.amount).toBe(orderData.amount);
    expect(savedOrder.items.length).toBe(orderData.items.length);
    expect(savedOrder.address.city).toBe(orderData.address.city);
  });

  test("should fail to create an order without required fields", async () => {
    const orderData = {
      userId: '1',
      items: [{ productId: "54321", quantity: 2 }],
      amount: 50.0,
      address: {
        street: "Test",
        number: 1,
        city: "City test",
        state: "state test",
        zipcode: "12348-548",
      },
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();
  
    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.userId).toBe(orderData.userId);
    expect(savedOrder.amount).toBe(orderData.amount);
    expect(savedOrder.items.length).toBe(orderData.items.length);
  });
  test("should have a default status of 'Food Processing'", async () => {
    const orderData = {
      userId: "12345",
      items: [{ productId: "54321", quantity: 2 }],
      amount: 50.0,
      address: {
        street: "Rua Teste",
        number: "100",
        city: "Cidade Teste",
        state: "Estado Teste",
        zipCode: "12345-678",
      },
      payment: true,
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    expect(savedOrder.status).toBe("Food Processing");
  });
});
