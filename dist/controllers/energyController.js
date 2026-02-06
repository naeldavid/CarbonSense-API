"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyController = void 0;
const calculations_1 = require("../services/calculations");
const emissionFactors_1 = require("../services/emissionFactors");
class EnergyController {
    /**
     * Calculate emissions for energy consumption
     */
    static calculateEnergy(req, res) {
        try {
            const { consumption, energyType } = req.body;
            if (!consumption || !energyType) {
                res.status(400).json({
                    error: 'Missing required fields: consumption, energyType',
                });
                return;
            }
            if (typeof consumption !== 'number' || consumption < 0) {
                res.status(400).json({
                    error: 'Consumption must be a positive number',
                });
                return;
            }
            const result = calculations_1.CalculationsService.calculateEnergy(consumption, energyType);
            res.json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json({ error: message });
        }
    }
    /**
     * Get available energy types and their factors
     */
    static getEnergyFactors(req, res) {
        const factors = emissionFactors_1.EmissionFactorsService.getFactorsByCategory('energy');
        res.json({
            energyTypes: factors.map((f) => ({
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
     * Compare efficiency between energy types
     */
    static compareEnergyTypes(req, res) {
        const factors = emissionFactors_1.EmissionFactorsService.getFactorsByCategory('energy');
        const comparison = factors
            .map((f) => ({
            type: f.activityType,
            id: f.id,
            intensity: f.value,
            unit: f.unit,
        }))
            .sort((a, b) => a.intensity - b.intensity);
        res.json({
            comparison,
            lowestEmissions: comparison[0],
            highestEmissions: comparison[comparison.length - 1],
        });
    }
}
exports.EnergyController = EnergyController;
