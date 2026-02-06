import { Router } from 'express';
import { ProductLifecycleController } from '../controllers/productLifecycleController';

const router = Router();

/**
 * @route POST /products/calculate
 * @description Calculate product lifecycle emissions
 * @body {
 *   quantity: number (required) - in kg,
 *   productType: string (required) - See /factors for available types
 * }
 * @example
 * POST /products/calculate
 * {
 *   "quantity": 100,
 *   "productType": "steel-production"
 * }
 */
router.post('/calculate', ProductLifecycleController.calculateProduct);

/**
 * @route GET /products/factors
 * @description Get available product types and emission factors
 */
router.get('/factors', ProductLifecycleController.getProductFactors);

/**
 * @route GET /products/compare
 * @description Compare emissions intensity of different product materials
 */
router.get('/compare', ProductLifecycleController.compareProducts);

export default router;
