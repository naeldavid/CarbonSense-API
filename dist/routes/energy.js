"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const energyController_1 = require("../controllers/energyController");
const router = (0, express_1.Router)();
/**
 * @route POST /energy/calculate
 * @description Calculate energy consumption emissions
 * @body {
 *   consumption: number (required),
 *   energyType: string (required) - See /factors for available types
 * }
 * @example
 * POST /energy/calculate
 * {
 *   "consumption": 1000,
 *   "energyType": "electricity-grid"
 * }
 */
router.post('/calculate', energyController_1.EnergyController.calculateEnergy);
/**
 * @route GET /energy/factors
 * @description Get available energy types and emission factors
 */
router.get('/factors', energyController_1.EnergyController.getEnergyFactors);
/**
 * @route GET /energy/compare
 * @description Compare emissions intensity of different energy types
 */
router.get('/compare', energyController_1.EnergyController.compareEnergyTypes);
exports.default = router;
