import { Request, Response } from 'express';
import { CalculationsService } from '../services/calculations';
import { EmissionFactorsService } from '../services/emissionFactors';

export class TransportationController {
  /**
   * Calculate emissions for a single transportation activity
   */
  static calculateTransport(req: Request, res: Response): void {
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
      const distanceKm = CalculationsService.convertUnit(
        distance,
        distanceUnit,
        'km'
      );

      const result = CalculationsService.calculateTransportation(
        distanceKm,
        method
      );

      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  }

  /**
   * Get available transportation methods and their factors
   */
  static getTransportationFactors(req: Request, res: Response): void {
    const factors = EmissionFactorsService.getFactorsByCategory('transportation');
    res.json({
      methods: factors.map((f) => ({
        id: f.id,
        name: f.activityType,
        factor: f.value,
        unit: f.unit,
        standard: f.standard,
      })),
      lastUpdated: EmissionFactorsService.getLastUpdated(),
    });
  }
}
