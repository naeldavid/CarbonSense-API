"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transportationController_1 = require("../controllers/transportationController");
const router = (0, express_1.Router)();
/**
 * @route POST /transportation/calculate
 * @description Calculate transportation emissions
 * @body {
 *   distance: number (required),
 *   method: string (required) - See /factors for available methods,
 *   distanceUnit: string (optional) - 'km' (default) or 'miles'
 * }
 * @example
 * POST /transportation/calculate
 * {
 *   "distance": 100,
 *   "method": "car-gasoline",
 *   "distanceUnit": "km"
 * }
 */
router.post('/calculate', transportationController_1.TransportationController.calculateTransport);
/**
 * @route GET /transportation/factors
 * @description Get available transportation methods and emission factors
 */
router.get('/factors', transportationController_1.TransportationController.getTransportationFactors);
exports.default = router;
