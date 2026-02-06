import { Router } from 'express';
import { TransportationController } from '../controllers/transportationController';

const router = Router();

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
router.post('/calculate', TransportationController.calculateTransport);

/**
 * @route GET /transportation/factors
 * @description Get available transportation methods and emission factors
 */
router.get('/factors', TransportationController.getTransportationFactors);

export default router;
