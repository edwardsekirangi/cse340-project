//Enforcing structure on our data and validating values

import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true, min: 1886 }, // first car invented
  color: { type: String, required: true },
  mileage: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  fuelType: { type: String, required: true, enum: ["Petrol", "Diesel", "Electric", "Hybrid"] },
  transmission: { type: String, required: true, enum: ["Automatic", "Manual"] },
  available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Car", carSchema);
