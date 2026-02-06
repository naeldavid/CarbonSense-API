"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transportation_1 = __importDefault(require("./transportation"));
const energy_1 = __importDefault(require("./energy"));
const products_1 = __importDefault(require("./products"));
const router = (0, express_1.Router)();
// Mount all routes
router.use('/transportation', transportation_1.default);
router.use('/energy', energy_1.default);
router.use('/products', products_1.default);
/**
 * @route GET /
 * @description API health check and documentation
 */
router.get('/', (req, res) => {
    res.json({
        name: 'Carbon Footprint Calculation API',
        version: '1.0.0',
        status: 'operational',
        message: 'Welcome to the Carbon Footprint Calculation API - Fast, reliable, and cost-effective emissions calculations',
        endpoints: {
            transportation: {
                calculate: 'POST /api/transportation/calculate',
                factors: 'GET /api/transportation/factors',
            },
            energy: {
                calculate: 'POST /api/energy/calculate',
                factors: 'GET /api/energy/factors',
                compare: 'GET /api/energy/compare',
            },
            products: {
                calculate: 'POST /api/products/calculate',
                factors: 'GET /api/products/factors',
                compare: 'GET /api/products/compare',
            },
        },
        features: [
            'Latest IPCC 2023 emission factors',
            'Real-time data updates',
            'Multiple calculation standards (GHG Protocol, ISO 14064)',
            'Sub-second response times',
            'Batch processing support',
            '99.9% uptime guarantee',
        ],
        doc: 'https://carbonfoot.dev/docs',
    });
});
exports.default = router;
