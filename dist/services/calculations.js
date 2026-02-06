"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculationsService = void 0;
const emissionFactors_1 = require("./emissionFactors");
class CalculationsService {
    /**
     * Calculate transportation emissions
     * @param distance - Distance traveled (km)
     * @param method - Transportation method (car-gasoline, flight-domestic, etc.)
     */
    static calculateTransportation(distance, method) {
        const factor = emissionFactors_1.EmissionFactorsService.getFactorById(method);
        if (!factor) {
            throw new Error(`Unknown transportation method: ${method}`);
        }
        const emissionsCO2e = distance * factor.value;
        return {
            activityType: factor.activityType,
            emissionsCO2e: Math.round(emissionsCO2e * 1000) / 1000, // Round to 3 decimals
            unit: 'kg CO2e',
            standard: factor.standard,
            breakDownByComponent: {
                'Direct emissions': emissionsCO2e,
            },
            offsetRecommendations: this.getOffsetRecommendations(emissionsCO2e),
            timestamp: new Date().toISOString(),
        };
    }
    /**
     * Calculate energy consumption emissions
     * @param consumption - Energy consumed (kWh or m³ depending on source)
     * @param energyType - Type of energy (electricity-grid, natural-gas, etc.)
     */
    static calculateEnergy(consumption, energyType) {
        const factor = emissionFactors_1.EmissionFactorsService.getFactorById(energyType);
        if (!factor) {
            throw new Error(`Unknown energy type: ${energyType}`);
        }
        const emissionsCO2e = consumption * factor.value;
        return {
            activityType: factor.activityType,
            emissionsCO2e: Math.round(emissionsCO2e * 1000) / 1000,
            unit: 'kg CO2e',
            standard: factor.standard,
            breakDownByComponent: {
                'Energy emissions': emissionsCO2e,
            },
            offsetRecommendations: this.getOffsetRecommendations(emissionsCO2e),
            timestamp: new Date().toISOString(),
        };
    }
    /**
     * Calculate product lifecycle emissions
     * @param quantity - Quantity (kg or units)
     * @param product - Product type (steel-production, aluminum-production, etc.)
     */
    static calculateProductLifecycle(quantity, product) {
        const factor = emissionFactors_1.EmissionFactorsService.getFactorById(product);
        if (!factor) {
            throw new Error(`Unknown product type: ${product}`);
        }
        const emissionsCO2e = quantity * factor.value;
        return {
            activityType: factor.activityType,
            emissionsCO2e: Math.round(emissionsCO2e * 1000) / 1000,
            unit: 'kg CO2e',
            standard: factor.standard,
            breakDownByComponent: {
                'Manufacturing emissions': emissionsCO2e,
            },
            offsetRecommendations: this.getOffsetRecommendations(emissionsCO2e),
            timestamp: new Date().toISOString(),
        };
    }
    /**
     * Perform batch calculations
     */
    static calculateBatch(calculations) {
        const startTime = Date.now();
        const results = [];
        let totalEmissions = 0;
        for (const calc of calculations) {
            let result;
            switch (calc.type) {
                case 'transportation':
                    result = this.calculateTransportation(calc.quantity, calc.activityId);
                    break;
                case 'energy':
                    result = this.calculateEnergy(calc.quantity, calc.activityId);
                    break;
                case 'product':
                    result = this.calculateProductLifecycle(calc.quantity, calc.activityId);
                    break;
                default:
                    throw new Error(`Unknown calculation type: ${calc.type}`);
            }
            results.push(result);
            totalEmissions += result.emissionsCO2e;
        }
        const processingTimeMs = Date.now() - startTime;
        return {
            results,
            totalEmissions: Math.round(totalEmissions * 1000) / 1000,
            processingTimeMs,
        };
    }
    /**
     * Generate offset recommendations based on emissions
     */
    static getOffsetRecommendations(emissionsCO2eKg) {
        const recommendations = [];
        if (emissionsCO2eKg > 0.1) {
            recommendations.push('Consider renewable energy sources');
        }
        if (emissionsCO2eKg > 0.5) {
            recommendations.push('Invest in carbon offset credits');
        }
        if (emissionsCO2eKg > 10) {
            recommendations.push('Develop a comprehensive decarbonization strategy');
        }
        if (emissionsCO2eKg > 100) {
            recommendations.push('Establish science-based emissions reduction targets');
            recommendations.push('Consider supply chain optimization');
        }
        return recommendations.length > 0
            ? recommendations
            : ['All activities produce some emissions - track and optimize'];
    }
    /**
     * Convert units for standardization
     */
    static convertUnit(value, fromUnit, toUnit) {
        const conversions = {
            'km': {
                'miles': 0.621371,
                'km': 1,
            },
            'miles': {
                'km': 1.60934,
                'miles': 1,
            },
            'kWh': {
                'MWh': 0.001,
                'kWh': 1,
            },
            'MWh': {
                'kWh': 1000,
                'MWh': 1,
            },
        };
        if (conversions[fromUnit] && conversions[fromUnit][toUnit]) {
            return value * conversions[fromUnit][toUnit];
        }
        return value; // Return original if no conversion found
    }
}
exports.CalculationsService = CalculationsService;
