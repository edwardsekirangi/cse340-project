//Enforcing structure on our data and validating values

import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema({
    carMake: { type: String, required: true, trim: true },
    carModel: { type: String, required: true, trim: true },
    reviewer: { type: String, required: true },
    rating: { type: Number, required: true, max: 10 }, // rating out of 10
    comment: { type: String, required: true },
});

export default mongoose.model("Review", reviewsSchema);
