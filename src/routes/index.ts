import { Router, Request, Response } from 'express';
import transportationRoutes from './transportation';
import energyRoutes from './energy';
import productRoutes from './products';

const router = Router();

// Mount all routes
router.use('/transportation', transportationRoutes);
router.use('/energy', energyRoutes);
router.use('/products', productRoutes);

/**
 * @route GET /
 * @description API health check and documentation
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Carbon Footprint Calculation API',
    version: '1.0.0',
    status: 'operational',
    message:
      'Welcome to the Carbon Footprint Calculation API - Fast, reliable, and cost-effective emissions calculations',
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

export default router;
