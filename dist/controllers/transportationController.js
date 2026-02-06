"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportationController = void 0;
const calculations_1 = require("../services/calculations");
const emissionFactors_1 = require("../services/emissionFactors");
class TransportationController {
    /**
     * Calculate emissions for a single transportation activity
     */
    static calculateTransport(req, res) {
        try {
            const { distance, method, distanceUnit = 'km' } = req.body;
            if (!distance || !method) {
                res.status(400).json({
                    error: 'Missing required fields: distance, method',
                });
                return;
            }
            if (typeof distance !== 'number' || distance < 0) {
                res.status(400).json({ error: 'Distance must be a positive number' });
                return;
            }
            // Convert distance to km if needed
            const distanceKm = calculations_1.CalculationsService.convertUnit(distance, distanceUnit, 'km');
            const result = calculations_1.CalculationsService.calculateTransportation(distanceKm, method);
            res.json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json({ error: message });
        }
    }
    /**
     * Get available transportation methods and their factors
     */
    static getTransportationFactors(req, res) {
        const factors = emissionFactors_1.EmissionFactorsService.getFactorsByCategory('transportation');
        res.json({
            methods: factors.map((f) => ({
                id: f.id,
                name: f.activityType,
                factor: f.value,
                unit: f.unit,
                standard: f.standard,
            })),
            lastUpdated: emissionFactors_1.EmissionFactorsService.getLastUpdated(),
        });
    }
}
exports.TransportationController = TransportationController;
