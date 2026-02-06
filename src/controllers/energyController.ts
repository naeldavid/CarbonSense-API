import { Request, Response } from 'express';
import { CalculationsService } from '../services/calculations';
import { EmissionFactorsService } from '../services/emissionFactors';

export class EnergyController {
  /**
   * Calculate emissions for energy consumption
   */
  static calculateEnergy(req: Request, res: Response): void {
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

      const result = CalculationsService.calculateEnergy(
        consumption,
        energyType
      );

      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  }

  /**
   * Get available energy types and their factors
   */
  static getEnergyFactors(req: Request, res: Response): void {
    const factors = EmissionFactorsService.getFactorsByCategory('energy');
    res.json({
      energyTypes: factors.map((f) => ({
        id: f.id,
        name: f.activityType,
        factor: f.value,
        unit: f.unit,
        standard: f.standard,
      })),
      lastUpdated: EmissionFactorsService.getLastUpdated(),
    });
  }

  /**
   * Compare efficiency between energy types
   */
  static compareEnergyTypes(req: Request, res: Response): void {
    const factors = EmissionFactorsService.getFactorsByCategory('energy');
    
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
