import express from "express";
import {
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
} from "../controllers/carController.js";
import isAuthenticated from "../middleware/authenticate.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - make
 *         - model
 *         - year
 *         - color
 *         - mileage
 *         - price
 *         - fuelType
 *         - transmission
 *       properties:
 *         make:
 *           type: string
 *           example: Toyota
 *         model:
 *           type: string
 *           example: Corolla
 *         year:
 *           type: integer
 *           example: 2020
 *         color:
 *           type: string
 *           example: White
 *         mileage:
 *           type: integer
 *           example: 25000
 *         price:
 *           type: number
 *           example: 18000
 *         fuelType:
 *           type: string
 *           enum: [Petrol, Diesel, Electric, Hybrid]
 *         transmission:
 *           type: string
 *           enum: [Automatic, Manual]
 *         available:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Get all cars
 *     responses:
 *       200:
 *         description: List of cars
 *   post:
 *     summary: Create a new car
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Car created
 */
router.get("/", getCars);
router.post("/", isAuthenticated, createCar);

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Get a car by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car found
 *       404:
 *         description: Car not found
 *   put:
 *     summary: Update a car
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Car updated
 *   delete:
 *     summary: Delete a car
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Car deleted
 */
router.get("/:id", getCarById);
router.put("/:id", isAuthenticated, updateCar);
router.delete("/:id", isAuthenticated, deleteCar);

export default router;
