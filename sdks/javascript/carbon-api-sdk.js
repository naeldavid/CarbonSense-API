/**
 * Carbon Footprint Calculation API - JavaScript SDK
 * 
 * Fast, reliable carbon emissions calculation with latest IPCC standards.
 * 
 * Usage:
 * 
 * import { CarbonClient } from './carbon-api-sdk.js';
 * 
 * const client = new CarbonClient({ apiKey: 'your-api-key' });
 * 
 * // Transportation
 * const result = await client.transportation.calculate({
 *   distance: 100,
 *   method: 'car-gasoline'
 * });
 * console.log(`Emissions: ${result.emissionsCO2e} kg CO2e`);
 * 
 * // Energy
 * const result = await client.energy.calculate({
 *   consumption: 1000,
 *   energyType: 'electricity-grid'
 * });
 * 
 * // Products
 * const result = await client.products.calculate({
 *   quantity: 100,
 *   productType: 'steel-production'
 * });
 */

/**
 * API Error class
 */
class CarbonAPIError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.name = 'CarbonAPIError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Base client for making API requests
 */
class BaseClient {
  constructor(baseUrl, apiKey = null) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  buildHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }
    return headers;
  }

  async request(method, endpoint, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: this.buildHeaders(),
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new CarbonAPIError(
          responseData.error || 'Unknown error',
          response.status,
          responseData
        );
      }

      return responseData;
    } catch (error) {
      if (error instanceof CarbonAPIError) {
        throw error;
      }
      throw new CarbonAPIError(`Network error: ${error.message}`, 0, error);
    }
  }

  async get(endpoint) {
    return this.request('GET', endpoint);
  }

  async post(endpoint, data) {
    return this.request('POST', endpoint, data);
  }
}

/**
 * Transportation emissions client
 */
class TransportationClient extends BaseClient {
  /**
   * Calculate transportation emissions
   * 
   * @param {Object} options
   * @param {number} options.distance - Distance traveled
   * @param {string} options.method - Transportation method (e.g., "car-gasoline", "flight-domestic")
   * @param {string} [options.distanceUnit="km"] - Unit of distance ("km" or "miles")
   * @returns {Promise<Object>} Calculation result
   */
  async calculate({ distance, method, distanceUnit = 'km' }) {
    if (!distance || !method) {
      throw new Error('Missing required parameters: distance, method');
    }

    return this.post('/transportation/calculate', {
      distance,
      method,
      distanceUnit,
    });
  }

  /**
   * Get available transportation methods
   * @returns {Promise<Object>} List of methods and factors
   */
  async getMethods() {
    return this.get('/transportation/factors');
  }
}

/**
 * Energy consumption emissions client
 */
class EnergyClient extends BaseClient {
  /**
   * Calculate energy consumption emissions
   * 
   * @param {Object} options
   * @param {number} options.consumption - Energy consumed
   * @param {string} options.energyType - Type of energy (e.g., "electricity-grid", "natural-gas")
   * @returns {Promise<Object>} Calculation result
   */
  async calculate({ consumption, energyType }) {
    if (!consumption || !energyType) {
      throw new Error('Missing required parameters: consumption, energyType');
    }

    return this.post('/energy/calculate', {
      consumption,
      energyType,
    });
  }

  /**
   * Get available energy types
   * @returns {Promise<Object>} List of energy types and factors
   */
  async getTypes() {
    return this.get('/energy/factors');
  }

  /**
   * Compare energy types by emissions intensity
   * @returns {Promise<Object>} Comparison data
   */
  async compare() {
    return this.get('/energy/compare');
  }
}

/**
 * Product lifecycle emissions client
 */
class ProductsClient extends BaseClient {
  /**
   * Calculate product lifecycle emissions
   * 
   * @param {Object} options
   * @param {number} options.quantity - Quantity in kg
   * @param {string} options.productType - Type of product (e.g., "steel-production", "aluminum-production")
   * @returns {Promise<Object>} Calculation result
   */
  async calculate({ quantity, productType }) {
    if (!quantity || !productType) {
      throw new Error('Missing required parameters: quantity, productType');
    }

    return this.post('/products/calculate', {
      quantity,
      productType,
    });
  }

  /**
   * Get available product types
   * @returns {Promise<Object>} List of products and factors
   */
  async getTypes() {
    return this.get('/products/factors');
  }

  /**
   * Compare products by emissions intensity
   * @returns {Promise<Object>} Comparison data
   */
  async compare() {
    return this.get('/products/compare');
  }
}

/**
 * Main Carbon Footprint API client
 */
class CarbonClient {
  /**
   * Initialize Carbon API client
   * 
   * @param {Object} options
   * @param {string} [options.apiKey] - Optional API key for authentication
   * @param {string} [options.baseUrl="http://localhost:3000/api"] - Base URL of the API
   */
  constructor({
    apiKey = null,
    baseUrl = 'http://localhost:3000/api',
  } = {}) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;

    this.transportation = new TransportationClient(baseUrl, apiKey);
    this.energy = new EnergyClient(baseUrl, apiKey);
    this.products = new ProductsClient(baseUrl, apiKey);
  }

  /**
   * Check API health status
   * @returns {Promise<Object>} Health status
   */
  async health() {
    const healthUrl = this.baseUrl.replace('/api', '') + '/health';
    const response = await fetch(healthUrl);
    return response.json();
  }
}

// Export for Node.js and browsers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CarbonClient,
    TransportationClient,
    EnergyClient,
    ProductsClient,
    CarbonAPIError,
  };
}

// Example usage
async function exampleUsage() {
  const client = new CarbonClient();

  try {
    // Transportation
    console.log('=== Transportation ===');
    const transportResult = await client.transportation.calculate({
      distance: 100,
      method: 'car-gasoline',
    });
    console.log(`Activity: ${transportResult.activityType}`);
    console.log(`Emissions: ${transportResult.emissionsCO2e} kg CO2e`);
    console.log(
      `Recommendations: ${transportResult.offsetRecommendations.join(', ')}\n`
    );

    // Energy
    console.log('=== Energy ===');
    const energyResult = await client.energy.calculate({
      consumption: 1000,
      energyType: 'electricity-grid',
    });
    console.log(`Activity: ${energyResult.activityType}`);
    console.log(`Emissions: ${energyResult.emissionsCO2e} kg CO2e`);
    console.log(
      `Recommendations: ${energyResult.offsetRecommendations.join(', ')}\n`
    );

    // Products
    console.log('=== Products ===');
    const productResult = await client.products.calculate({
      quantity: 100,
      productType: 'steel-production',
    });
    console.log(`Activity: ${productResult.activityType}`);
    console.log(`Emissions: ${productResult.emissionsCO2e} kg CO2e`);
    console.log(
      `Recommendations: ${productResult.offsetRecommendations.join(', ')}\n`
    );

    // Health
    console.log('=== Health ===');
    const health = await client.health();
    console.log(`Status: ${health.status}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run example if executed directly
if (typeof window === 'undefined' && require.main === module) {
  exampleUsage();
}
