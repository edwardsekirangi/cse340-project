import Review from "../models/reviews.js";
import createError from "http-errors";

// Get all reviews
export const getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (err) {
        next(err);
    }
};

// Get review by ID
export const getReviewById = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return next(createError(404, "Review not found"));
        res.status(200).json(review);
    } catch (err) {
        next(err);
    }
};

// Create a new review
export const createReview = async (req, res, next) => {
    try {
        const review = new Review(req.body);
        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (err) {
        next(err);
    }
};

// Update a review by ID
export const updateReview = async (req, res, next) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedReview) return next(createError(404, "Review not found"));
        res.status(200).json(updatedReview);
    } catch (err) {
        next(err);
    }
};

// Delete a review by ID
export const deleteReview = async (req, res, next) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) return next(createError(404, "Review not found"));
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        next(err);
    }
};
