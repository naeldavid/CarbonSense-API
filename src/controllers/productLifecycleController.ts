import { Request, Response } from 'express';
import { CalculationsService } from '../services/calculations';
import { EmissionFactorsService } from '../services/emissionFactors';

export class ProductLifecycleController {
  /**
   * Calculate emissions for product lifecycle
   */
  static calculateProduct(req: Request, res: Response): void {
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

      const result = CalculationsService.calculateProductLifecycle(
        quantity,
        productType
      );

      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  }

  /**
   * Get available product types and their factors
   */
  static getProductFactors(req: Request, res: Response): void {
    const factors = EmissionFactorsService.getFactorsByCategory('manufacturing');
    res.json({
      products: factors.map((f) => ({
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
   * Compare product materials and their environmental impact
   */
  static compareProducts(req: Request, res: Response): void {
    const factors = EmissionFactorsService.getFactorsByCategory('manufacturing');
    
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
