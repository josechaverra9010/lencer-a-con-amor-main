import json
import requests

# Assuming the backend is running
BASE_URL = "http://localhost:8000/api"

# Mock data from products.ts (simplified for seeding)
# In a real scenario, we might import this or have it as a JSON file
products_data = [
    {
        "name": "Conjunto Encaje Noir",
        "description": "Elegante conjunto de encaje francés con detalles bordados a mano. Perfecto para ocasiones especiales, combina sofisticación y sensualidad.",
        "price": 89.99,
        "original_price": 129.99,
        "images": ["/assets/product-1.jpg", "/assets/product-2.jpg"],
        "category_id": 1, # Conjuntos
        "sizes": ["XS", "S", "M", "L", "XL"],
        "is_new": True,
        "is_sale": True,
        "features": ["Encaje francés premium", "Bordado artesanal"],
        "color_ids": [1, 2, 3] # Negro, Rosa, Vino
    },
    {
        "name": "Bralette Satén Rose",
        "description": "Bralette de satén con tirantes ajustables y escote profundo. Comodidad y elegancia para el día a día.",
        "price": 45.99,
        "images": ["/assets/product-2.jpg", "/assets/product-1.jpg"],
        "category_id": 2, # Bralettes
        "sizes": ["XS", "S", "M", "L"],
        "is_new": True,
        "features": ["Satén de alta calidad", "Tirantes ajustables"],
        "color_ids": [2, 4, 1] # Rosa, Champagne, Negro
    },
    # Add more if needed
]

def seed():
    # 1. Seed Categories and Colors first (using the endpoint we created)
    print("Seeding categories and colors...")
    requests.post(f"{BASE_URL}/seed")

    # 2. Add individual products
    print("Seeding products...")
    for product in products_data:
        response = requests.post(f"{BASE_URL}/products", json=product)
        if response.status_code == 200:
            print(f"Added product: {product['name']}")
        else:
            print(f"Failed to add {product['name']}: {response.text}")

# First we need to add a POST endpoint for products in main.py or crud.py
if __name__ == "__main__":
    # This script requires the backend to be running and have the POST products endpoint
    print("This script is a template. Make sure the backend has a POST /products endpoint.")
