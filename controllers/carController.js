import Car from "../models/car.js";
import createError from "http-errors";

//Get all cars
export const getCars = async (req, res, next) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (err) {
        next(err);
    }
};

//Get car by ID
export const getCarById = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return next(createError(404, "Car not found"));
        res.status(200).json(car);
    } catch (err) {
        next(err);
    }
};

//Create a new car
export const createCar = async (req, res, next) => {
    try {
        const car = new Car(req.body);
        const savedCar = await car.save();
        res.status(201).json(savedCar);
    } catch (err) {
        next(err);
    }
};

//Update a car by Id
export const updateCar = async (req, res, next) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCar) return next(createError(404, "Car not found"));
        res.status(200).json(updatedCar);
    } catch (err) {
        next(err);
    }
};

//Delete a car by Id
export const deleteCar = async (req, res, next) => {
    try {
        const deletedCar = await Car.findByIdAndDelete(req.params.id);
        if (!deletedCar) return next(createError(404, "Car not found"));
        res.status(200).json({ message: "Car deleted successfully" });
    } catch (err) {
        next(err);
    }
};
