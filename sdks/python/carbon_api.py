"""
Carbon Footprint Calculation API - Python SDK

Fast, reliable carbon emissions calculation with latest IPCC standards.

Usage:
    from carbon_api import CarbonClient
    
    client = CarbonClient(api_key="your-api-key")
    
    # Transportation
    result = client.transportation.calculate(distance=100, method="car-gasoline")
    print(f"Emissions: {result['emissionsCO2e']} kg CO2e")
    
    # Energy
    result = client.energy.calculate(consumption=1000, energy_type="electricity-grid")
    print(f"Emissions: {result['emissionsCO2e']} kg CO2e")
    
    # Products
    result = client.products.calculate(quantity=100, product_type="steel-production")
    print(f"Emissions: {result['emissionsCO2e']} kg CO2e")
"""

import requests
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from datetime import datetime


@dataclass
class CalculationResult:
    """Represents an emissions calculation result"""
    activity_type: str
    emissions_co2e: float
    unit: str
    standard: str
    break_down_by_component: Optional[Dict[str, float]] = None
    offset_recommendations: Optional[List[str]] = None
    timestamp: Optional[str] = None


class APIError(Exception):
    """Raised when API request fails"""
    pass


class TransportationClient:
    """Client for transportation emissions calculations"""
    
    def __init__(self, base_url: str, api_key: Optional[str] = None):
        self.base_url = base_url
        self.api_key = api_key
        self.headers = self._build_headers()
    
    def _build_headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["X-API-Key"] = self.api_key
        return headers
    
    def calculate(
        self,
        distance: float,
        method: str,
        distance_unit: str = "km"
    ) -> CalculationResult:
        """
        Calculate transportation emissions.
        
        Args:
            distance: Distance traveled (number)
            method: Transportation method (e.g., "car-gasoline", "flight-domestic")
            distance_unit: Unit of distance ("km" or "miles")
        
        Returns:
            CalculationResult with emissions data
        
        Raises:
            APIError: If request fails
        """
        url = f"{self.base_url}/transportation/calculate"
        payload = {
            "distance": distance,
            "method": method,
            "distanceUnit": distance_unit
        }
        
        response = requests.post(url, json=payload, headers=self.headers)
        self._handle_response(response)
        
        data = response.json()
        return CalculationResult(
            activity_type=data["activityType"],
            emissions_co2e=data["emissionsCO2e"],
            unit=data["unit"],
            standard=data["standard"],
            break_down_by_component=data.get("breakDownByComponent"),
            offset_recommendations=data.get("offsetRecommendations"),
            timestamp=data.get("timestamp")
        )
    
    def get_methods(self) -> Dict[str, Any]:
        """Get available transportation methods and their factors"""
        url = f"{self.base_url}/transportation/factors"
        response = requests.get(url, headers=self.headers)
        self._handle_response(response)
        return response.json()
    
    @staticmethod
    def _handle_response(response: requests.Response) -> None:
        """Handle API response and raise errors if needed"""
        if response.status_code >= 400:
            data = response.json()
            raise APIError(f"API Error: {data.get('error', 'Unknown error')}")


class EnergyClient:
    """Client for energy consumption emissions calculations"""
    
    def __init__(self, base_url: str, api_key: Optional[str] = None):
        self.base_url = base_url
        self.api_key = api_key
        self.headers = self._build_headers()
    
    def _build_headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["X-API-Key"] = self.api_key
        return headers
    
    def calculate(
        self,
        consumption: float,
        energy_type: str
    ) -> CalculationResult:
        """
        Calculate energy consumption emissions.
        
        Args:
            consumption: Energy consumed (kWh, m³, etc. depending on type)
            energy_type: Type of energy (e.g., "electricity-grid", "natural-gas")
        
        Returns:
            CalculationResult with emissions data
        
        Raises:
            APIError: If request fails
        """
        url = f"{self.base_url}/energy/calculate"
        payload = {
            "consumption": consumption,
            "energyType": energy_type
        }
        
        response = requests.post(url, json=payload, headers=self.headers)
        self._handle_response(response)
        
        data = response.json()
        return CalculationResult(
            activity_type=data["activityType"],
            emissions_co2e=data["emissionsCO2e"],
            unit=data["unit"],
            standard=data["standard"],
            break_down_by_component=data.get("breakDownByComponent"),
            offset_recommendations=data.get("offsetRecommendations"),
            timestamp=data.get("timestamp")
        )
    
    def get_types(self) -> Dict[str, Any]:
        """Get available energy types and their factors"""
        url = f"{self.base_url}/energy/factors"
        response = requests.get(url, headers=self.headers)
        self._handle_response(response)
        return response.json()
    
    def compare(self) -> Dict[str, Any]:
        """Compare energy types by emissions intensity"""
        url = f"{self.base_url}/energy/compare"
        response = requests.get(url, headers=self.headers)
        self._handle_response(response)
        return response.json()
    
    @staticmethod
    def _handle_response(response: requests.Response) -> None:
        """Handle API response and raise errors if needed"""
        if response.status_code >= 400:
            data = response.json()
            raise APIError(f"API Error: {data.get('error', 'Unknown error')}")


class ProductsClient:
    """Client for product lifecycle emissions calculations"""
    
    def __init__(self, base_url: str, api_key: Optional[str] = None):
        self.base_url = base_url
        self.api_key = api_key
        self.headers = self._build_headers()
    
    def _build_headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["X-API-Key"] = self.api_key
        return headers
    
    def calculate(
        self,
        quantity: float,
        product_type: str
    ) -> CalculationResult:
        """
        Calculate product lifecycle emissions.
        
        Args:
            quantity: Quantity in kg
            product_type: Type of product (e.g., "steel-production", "aluminum-production")
        
        Returns:
            CalculationResult with emissions data
        
        Raises:
            APIError: If request fails
        """
        url = f"{self.base_url}/products/calculate"
        payload = {
            "quantity": quantity,
            "productType": product_type
        }
        
        response = requests.post(url, json=payload, headers=self.headers)
        self._handle_response(response)
        
        data = response.json()
        return CalculationResult(
            activity_type=data["activityType"],
            emissions_co2e=data["emissionsCO2e"],
            unit=data["unit"],
            standard=data["standard"],
            break_down_by_component=data.get("breakDownByComponent"),
            offset_recommendations=data.get("offsetRecommendations"),
            timestamp=data.get("timestamp")
        )
    
    def get_types(self) -> Dict[str, Any]:
        """Get available product types and their factors"""
        url = f"{self.base_url}/products/factors"
        response = requests.get(url, headers=self.headers)
        self._handle_response(response)
        return response.json()
    
    def compare(self) -> Dict[str, Any]:
        """Compare products by emissions intensity"""
        url = f"{self.base_url}/products/compare"
        response = requests.get(url, headers=self.headers)
        self._handle_response(response)
        return response.json()
    
    @staticmethod
    def _handle_response(response: requests.Response) -> None:
        """Handle API response and raise errors if needed"""
        if response.status_code >= 400:
            data = response.json()
            raise APIError(f"API Error: {data.get('error', 'Unknown error')}")


class CarbonClient:
    """Main client for Carbon Footprint Calculation API"""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "http://localhost:3000/api"
    ):
        """
        Initialize Carbon API client.
        
        Args:
            api_key: Optional API key for authentication
            base_url: Base URL of the API (default: http://localhost:3000/api)
        """
        self.api_key = api_key
        self.base_url = base_url
        
        self.transportation = TransportationClient(base_url, api_key)
        self.energy = EnergyClient(base_url, api_key)
        self.products = ProductsClient(base_url, api_key)
    
    def health(self) -> Dict[str, Any]:
        """Check API health status"""
        url = f"{self.base_url.replace('/api', '')}/health"
        response = requests.get(url)
        return response.json()


if __name__ == "__main__":
    # Example usage
    client = CarbonClient()
    
    # Calculate car emissions
    print("=== Transportation ===")
    result = client.transportation.calculate(distance=100, method="car-gasoline")
    print(f"Activity: {result.activity_type}")
    print(f"Emissions: {result.emissions_co2e} kg CO2e")
    print(f"Recommendations: {result.offset_recommendations}\n")
    
    # Calculate electricity emissions
    print("=== Energy ===")
    result = client.energy.calculate(consumption=1000, energy_type="electricity-grid")
    print(f"Activity: {result.activity_type}")
    print(f"Emissions: {result.emissions_co2e} kg CO2e")
    print(f"Recommendations: {result.offset_recommendations}\n")
    
    # Calculate steel production
    print("=== Products ===")
    result = client.products.calculate(quantity=100, product_type="steel-production")
    print(f"Activity: {result.activity_type}")
    print(f"Emissions: {result.emissions_co2e} kg CO2e")
    print(f"Recommendations: {result.offset_recommendations}\n")
    
    # Check health
    print("=== Health ===")
    health = client.health()
    print(f"Status: {health['status']}")
