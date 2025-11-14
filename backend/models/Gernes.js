import mongoose from "mongoose";

const gerneSchema = new mongoose.Schema({
    id: Number,
    name: String
})

export default mongoose.Model("Gernes", gerneSchema);
