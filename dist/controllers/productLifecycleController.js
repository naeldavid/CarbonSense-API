"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductLifecycleController = void 0;
const calculations_1 = require("../services/calculations");
const emissionFactors_1 = require("../services/emissionFactors");
class ProductLifecycleController {
    /**
     * Calculate emissions for product lifecycle
     */
    static calculateProduct(req, res) {
        try {
            const { quantity, productType } = req.body;
            if (!quantity || !productType) {
                res.status(400).json({
                    error: 'Missing required fields: quantity, productType',
                });
                return;
            }
            if (typeof quantity !== 'number' || quantity < 0) {
                res.status(400).json({
                    error: 'Quantity must be a positive number',
                });
                return;
            }
            const result = calculations_1.CalculationsService.calculateProductLifecycle(quantity, productType);
            res.json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json({ error: message });
        }
    }
    /**
     * Get available product types and their factors
     */
    static getProductFactors(req, res) {
        const factors = emissionFactors_1.EmissionFactorsService.getFactorsByCategory('manufacturing');
        res.json({
            products: factors.map((f) => ({
                id: f.id,
                name: f.activityType,
                factor: f.value,
                unit: f.unit,
                standard: f.standard,
            })),
            lastUpdated: emissionFactors_1.EmissionFactorsService.getLastUpdated(),
        });
    }
    /**
     * Compare product materials and their environmental impact
     */
    static compareProducts(req, res) {
        const factors = emissionFactors_1.EmissionFactorsService.getFactorsByCategory('manufacturing');
        const comparison = factors
            .map((f) => ({
            product: f.activityType,
            id: f.id,
            intensity: f.value,
            unit: f.unit,
        }))
            .sort((a, b) => a.intensity - b.intensity);
        // Calculate for 1kg comparison
        const oneKgComparison = comparison.map((c) => ({
            ...c,
            emissionsPerKg: c.intensity,
        }));
        res.json({
            comparison: oneKgComparison,
            lowestEmissions: oneKgComparison[0],
            highestEmissions: oneKgComparison[oneKgComparison.length - 1],
        });
    }
}
exports.ProductLifecycleController = ProductLifecycleController;
