// Emission factors based on IPCC 2023, GHG Protocol, and ISO 14064 standards
// All values in CO2e per unit activity

export interface EmissionFactor {
  id: string;
  activityType: string;
  category: string;
  value: number; // kg CO2e per unit
  unit: string;
  standard: string;
  dataSource: string;
  lastUpdated: string;
  region?: string;
}

const emissionFactors: Record<string, EmissionFactor> = {
  // TRANSPORTATION - CO2e per km/mile
  'car-gasoline': {
    id: 'car-gasoline',
    activityType: 'Car Travel (Gasoline)',
    category: 'transportation',
    value: 0.192, // kg CO2e per km (IPCC 2023)
    unit: 'kg CO2e/km',
    standard: 'IPCC_2023',
    dataSource: 'IPCC AR6',
    lastUpdated: new Date().toISOString(),
  },
  'car-diesel': {
    id: 'car-diesel',
    activityType: 'Car Travel (Diesel)',
    category: 'transportation',
    value: 0.171, // kg CO2e per km
    unit: 'kg CO2e/km',
    standard: 'IPCC_2023',
    dataSource: 'IPCC AR6',
    lastUpdated: new Date().toISOString(),
  },
  'car-electric': {
    id: 'car-electric',
    activityType: 'Car Travel (Electric)',
    category: 'transportation',
    value: 0.053, // kg CO2e per km (grid-dependent)
    unit: 'kg CO2e/km',
    standard: 'IPCC_2023',
    dataSource: 'IPCC AR6',
    lastUpdated: new Date().toISOString(),
  },
  'flight-domestic': {
    id: 'flight-domestic',
    activityType: 'Domestic Flight',
    category: 'transportation',
    value: 0.255, // kg CO2e per km (IPCC 2023)
    unit: 'kg CO2e/km',
    standard: 'IPCC_2023',
    dataSource: 'IPCC AR6',
    lastUpdated: new Date().toISOString(),
  },
  'flight-international': {
    id: 'flight-international',
    activityType: 'International Flight',
    category: 'transportation',
    value: 0.195, // kg CO2e per km (includes RFI)
    unit: 'kg CO2e/km',
    standard: 'IPCC_2023',
    dataSource: 'IPCC AR6',
    lastUpdated: new Date().toISOString(),
  },
  'train': {
    id: 'train',
    activityType: 'Train Travel',
    category: 'transportation',
    value: 0.041, // kg CO2e per km
    unit: 'kg CO2e/km',
    standard: 'IPCC_2023',
    dataSource: 'IPCC AR6',
    lastUpdated: new Date().toISOString(),
  },
  'bus': {
    id: 'bus',
    activityType: 'Bus Travel',
    category: 'transportation',
    value: 0.089, // kg CO2e per km
    unit: 'kg CO2e/km',
    standard: 'IPCC_2023',
    dataSource: 'IPCC AR6',
    lastUpdated: new Date().toISOString(),
  },
  'ferry': {
    id: 'ferry',
    activityType: 'Ferry Travel',
    category: 'transportation',
    value: 0.13, // kg CO2e per km
    unit: 'kg CO2e/km',
    standard: 'IPCC_2023',
    dataSource: 'IPCC AR6',
    lastUpdated: new Date().toISOString(),
  },
  'shipping': {
    id: 'shipping',
    activityType: 'Cargo Shipping',
    category: 'transportation',
    value: 0.00012, // kg CO2e per kg*km (container ship)
    unit: 'kg CO2e/kg-km',
    standard: 'IPCC_2023',
    dataSource: 'IPCC AR6',
    lastUpdated: new Date().toISOString(),
  },

  // ENERGY CONSUMPTION - CO2e per kWh
  'electricity-grid': {
    id: 'electricity-grid',
    activityType: 'Electricity (Grid Average)',
    category: 'energy',
    value: 0.489, // kg CO2e per kWh (global average)
    unit: 'kg CO2e/kWh',
    standard: 'IPCC_2023',
    dataSource: 'IEA',
    lastUpdated: new Date().toISOString(),
  },
  'electricity-renewable': {
    id: 'electricity-renewable',
    activityType: 'Renewable Electricity',
    category: 'energy',
    value: 0.011, // kg CO2e per kWh
    unit: 'kg CO2e/kWh',
    standard: 'IPCC_2023',
    dataSource: 'IRENA',
    lastUpdated: new Date().toISOString(),
  },
  'natural-gas': {
    id: 'natural-gas',
    activityType: 'Natural Gas',
    category: 'energy',
    value: 1.96, // kg CO2e per m³
    unit: 'kg CO2e/m³',
    standard: 'IPCC_2023',
    dataSource: 'IPCC AR6',
    lastUpdated: new Date().toISOString(),
  },
  'heating-oil': {
    id: 'heating-oil',
    activityType: 'Heating Oil',
    category: 'energy',
    value: 3.15, // kg CO2e per liter
    unit: 'kg CO2e/L',
    standard: 'IPCC_2023',
    dataSource: 'IPCC AR6',
    lastUpdated: new Date().toISOString(),
  },
  'coal': {
    id: 'coal',
    activityType: 'Coal',
    category: 'energy',
    value: 2.45, // kg CO2e per kg
    unit: 'kg CO2e/kg',
    standard: 'IPCC_2023',
    dataSource: 'IPCC AR6',
    lastUpdated: new Date().toISOString(),
  },

  // PRODUCT LIFECYCLE - CO2e per unit
  'steel-production': {
    id: 'steel-production',
    activityType: 'Steel Production',
    category: 'manufacturing',
    value: 1.85, // kg CO2e per kg
    unit: 'kg CO2e/kg',
    standard: 'ISO_14064',
    dataSource: 'World Steel Association',
    lastUpdated: new Date().toISOString(),
  },
  'aluminum-production': {
    id: 'aluminum-production',
    activityType: 'Aluminum Production',
    category: 'manufacturing',
    value: 12.5, // kg CO2e per kg (highly dependent on energy source)
    unit: 'kg CO2e/kg',
    standard: 'ISO_14064',
    dataSource: 'International Aluminum Institute',
    lastUpdated: new Date().toISOString(),
  },
  'plastic-production': {
    id: 'plastic-production',
    activityType: 'Plastic Production',
    category: 'manufacturing',
    value: 3.8, // kg CO2e per kg
    unit: 'kg CO2e/kg',
    standard: 'ISO_14064',
    dataSource: 'Plastics Industry Association',
    lastUpdated: new Date().toISOString(),
  },
  'concrete-production': {
    id: 'concrete-production',
    activityType: 'Concrete Production',
    category: 'manufacturing',
    value: 0.15, // kg CO2e per kg
    unit: 'kg CO2e/kg',
    standard: 'ISO_14064',
    dataSource: 'Cement Sustainability Initiative',
    lastUpdated: new Date().toISOString(),
  },
  'clothing-cotton': {
    id: 'clothing-cotton',
    activityType: 'Cotton Clothing',
    category: 'manufacturing',
    value: 2.7, // kg CO2e per kg of cotton
    unit: 'kg CO2e/kg',
    standard: 'ISO_14064',
    dataSource: 'Textile Exchange',
    lastUpdated: new Date().toISOString(),
  },
  'clothing-polyester': {
    id: 'clothing-polyester',
    activityType: 'Polyester Clothing',
    category: 'manufacturing',
    value: 5.5, // kg CO2e per kg of polyester
    unit: 'kg CO2e/kg',
    standard: 'ISO_14064',
    dataSource: 'Textile Exchange',
    lastUpdated: new Date().toISOString(),
  },
};

export class EmissionFactorsService {
  /**
   * Get emission factor by ID
   */
  static getFactorById(id: string): EmissionFactor | undefined {
    return emissionFactors[id];
  }

  /**
   * Get all emission factors
   */
  static getAllFactors(): EmissionFactor[] {
    return Object.values(emissionFactors);
  }

  /**
   * Get factors by category
   */
  static getFactorsByCategory(category: string): EmissionFactor[] {
    return Object.values(emissionFactors).filter(
      (factor) => factor.category === category
    );
  }

  /**
   * Search factors by keyword
   */
  static searchFactors(keyword: string): EmissionFactor[] {
    const lowerKeyword = keyword.toLowerCase();
    return Object.values(emissionFactors).filter(
      (factor) =>
        factor.activityType.toLowerCase().includes(lowerKeyword) ||
        factor.id.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Get latest update timestamp
   */
  static getLastUpdated(): string {
    return new Date().toISOString();
  }
}
