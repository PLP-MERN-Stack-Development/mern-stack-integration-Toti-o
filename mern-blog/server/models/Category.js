import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  _id: { type: Number },
  name: { type: String, required: true }
});

export default mongoose.model("Category", categorySchema);
