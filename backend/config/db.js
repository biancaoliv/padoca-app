import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect("mongodb+srv://padaria:Bia%402110@cluster0.ml7tb.mongodb.net/padoca-app")
    .then(() => console.log("DB Connected"));
};
