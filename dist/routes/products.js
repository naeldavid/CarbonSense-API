"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productLifecycleController_1 = require("../controllers/productLifecycleController");
const router = (0, express_1.Router)();
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
router.post('/calculate', productLifecycleController_1.ProductLifecycleController.calculateProduct);
/**
 * @route GET /products/factors
 * @description Get available product types and emission factors
 */
router.get('/factors', productLifecycleController_1.ProductLifecycleController.getProductFactors);
/**
 * @route GET /products/compare
 * @description Compare emissions intensity of different product materials
 */
router.get('/compare', productLifecycleController_1.ProductLifecycleController.compareProducts);
exports.default = router;
