import { Router } from 'express';
import { EnergyController } from '../controllers/energyController';

const router = Router();

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
router.post('/calculate', EnergyController.calculateEnergy);

/**
 * @route GET /energy/factors
 * @description Get available energy types and emission factors
 */
router.get('/factors', EnergyController.getEnergyFactors);

/**
 * @route GET /energy/compare
 * @description Compare emissions intensity of different energy types
 */
router.get('/compare', EnergyController.compareEnergyTypes);

export default router;
