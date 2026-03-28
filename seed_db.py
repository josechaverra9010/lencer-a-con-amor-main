import json
from database import SessionLocal, engine
import models

def seed():
    db = SessionLocal()
    try:
        # 1. Seed Categories
        print("Seeding categories...")
        categories_data = [
            "Conjuntos", "Bralettes", "Bodies", "Kimonos", 
            "Brasiers", "Panties", "Babydolls", "Corsets", "Juguetes"
        ]
        
        cat_map = {}
        for cat_name in categories_data:
            cat = db.query(models.Category).filter(models.Category.name == cat_name).first()
            if not cat:
                cat = models.Category(name=cat_name)
                db.add(cat)
                db.commit()
                db.refresh(cat)
            cat_map[cat_name] = cat.id

        # 2. Seed Colors
        print("Seeding colors...")
        colors_data = [
            {"name": "Negro", "value": "#1a1a1a"},
            {"name": "Rosa", "value": "#d4a5a5"},
            {"name": "Vino", "value": "#722f37"},
            {"name": "Champagne", "value": "#f7e7ce"},
            {"name": "Burdeos", "value": "#800020"},
            {"name": "Blush", "value": "#f5e1da"},
            {"name": "Ivory", "value": "#fffff0"},
            {"name": "Nude", "value": "#e3c9a8"},
            {"name": "Blanco", "value": "#ffffff"},
            {"name": "Rojo", "value": "#c41e3a"},
            {"name": "Rojo Oscuro", "value": "#8b0000"},
            {"name": "Lavanda", "value": "#e6e6fa"},
        ]
        
        color_map = {}
        for color_info in colors_data:
            color = db.query(models.Color).filter(models.Color.name == color_info["name"]).first()
            if not color:
                color = models.Color(name=color_info["name"], value=color_info["value"])
                db.add(color)
                db.commit()
                db.refresh(color)
            color_map[color_info["name"]] = color

        # 3. Seed Products
        print("Seeding products...")
        products = [
            {
                "name": "Conjunto Encaje Noir",
                "description": "Elegante conjunto de encaje francés con detalles bordados a mano. Perfecto para ocasiones especiales, combina sofisticación y sensualidad.",
                "price": 89900,
                "original_price": 129900,
                "images": ["/product-1.jpg", "/product-2.jpg", "/product-3.jpg", "/product-4.jpg"],
                "category_id": cat_map["Conjuntos"],
                "sizes": ["XS", "S", "M", "L", "XL"],
                "is_new": True,
                "is_sale": True,
                "features": ["Encaje francés premium", "Bordado artesanal", "Copa con varilla", "Braguita con cierre lateral"],
                "colors": [color_map["Negro"], color_map["Rosa"], color_map["Vino"]]
            },
            {
                "name": "Bralette Satén Rose",
                "description": "Bralette de satén con tirantes ajustables y escote profundo. Comodidad y elegancia para el día a día.",
                "price": 45900,
                "images": ["/product-2.jpg", "/product-1.jpg", "/product-3.jpg", "/product-4.jpg"],
                "category_id": cat_map["Bralettes"],
                "sizes": ["XS", "S", "M", "L"],
                "is_new": True,
                "features": ["Satén de alta calidad", "Tirantes ajustables", "Sin varilla para mayor comodidad", "Cierre trasero"],
                "colors": [color_map["Rosa"], color_map["Champagne"], color_map["Negro"]]
            },
            {
                "name": "Body Midnight Velvet",
                "description": "Body de terciopelo con espalda descubierta y detalles de encaje. Una pieza statement para noches especiales.",
                "price": 79900,
                "original_price": 99900,
                "images": ["/product-3.jpg", "/product-1.jpg", "/product-2.jpg", "/product-4.jpg"],
                "category_id": cat_map["Bodies"],
                "sizes": ["S", "M", "L", "XL"],
                "is_sale": True,
                "features": ["Terciopelo italiano", "Espalda descubierta", "Cierre snap", "Tirantes removibles"],
                "colors": [color_map["Negro"], color_map["Burdeos"]]
            },
            {
                "name": "Kimono Seda Blush",
                "description": "Kimono de seda natural con estampado floral exclusivo. La pieza perfecta para completar tu look de boudoir.",
                "price": 120000,
                "images": ["/product-4.jpg", "/product-1.jpg", "/product-2.jpg", "/product-3.jpg"],
                "category_id": cat_map["Kimonos"],
                "sizes": ["S/M", "L/XL"],
                "features": ["100% seda natural", "Estampado exclusivo", "Cinturón a juego", "Largo midi"],
                "colors": [color_map["Blush"], color_map["Ivory"]]
            },
            {
                "name": "Sujetador Push-Up Luna",
                "description": "Sujetador push-up con relleno extraíble y cierre frontal. Realza tu figura con elegancia.",
                "price": 55900,
                "images": ["/product-1.jpg", "/product-3.jpg", "/product-2.jpg", "/product-4.jpg"],
                "category_id": cat_map["Brasiers"],
                "sizes": ["32B", "34B", "34C", "36B", "36C", "38C"],
                "features": ["Relleno extraíble", "Cierre frontal", "Tirantes acolchados", "Espalda en U"],
                "colors": [color_map["Nude"], color_map["Negro"], color_map["Rosa"]]
            },
            {
                "name": "Tanga Encaje Parisienne",
                "description": "Tanga de encaje con cintura alta y diseño cómodo para uso diario sin marcar.",
                "price": 25900,
                "images": ["/product-2.jpg", "/product-4.jpg", "/product-1.jpg", "/product-3.jpg"],
                "category_id": cat_map["Panties"],
                "sizes": ["XS", "S", "M", "L", "XL"],
                "is_new": True,
                "features": ["Encaje elástico", "Cintura alta", "Sin costuras visibles", "Algodón en entrepierna"],
                "colors": [color_map["Negro"], color_map["Blanco"], color_map["Rosa"], color_map["Rojo"]]
            },
            {
                "name": "Babydoll Romántico",
                "description": "Babydoll de tul con aplicaciones de encaje y lazo de satén. Romántico y femenino.",
                "price": 65900,
                "original_price": 85900,
                "images": ["/product-3.jpg", "/product-2.jpg", "/product-4.jpg", "/product-1.jpg"],
                "category_id": cat_map["Babydolls"],
                "sizes": ["S", "M", "L"],
                "is_sale": True,
                "features": ["Tul suave", "Encaje en busto", "Incluye tanga a juego", "Lazo decorativo"],
                "colors": [color_map["Rosa"], color_map["Negro"], color_map["Lavanda"]]
            },
            {
                "name": "Corsé Vintage Glamour",
                "description": "Corsé con ballenas flexibles y cierre de corchetes. Esculpe tu silueta con estilo retro.",
                "price": 95900,
                "images": ["/product-4.jpg", "/product-3.jpg", "/product-1.jpg", "/product-2.jpg"],
                "category_id": cat_map["Corsets"],
                "sizes": ["XS", "S", "M", "L"],
                "features": ["Ballenas flexibles", "Cierre de corchetes", "Copas con varilla", "Detalle de encaje superior"],
                "colors": [color_map["Negro"], color_map["Rojo Oscuro"]]
            },
            {
                "name": "Vibrador Varita Mágica",
                "description": "Poderoso vibrador de varita con 10 modos de vibración y silicona de grado médico. Sumergible y recargable.",
                "price": 149900,
                "original_price": 189900,
                "images": ["/product-1.jpg"],
                "category_id": cat_map["Juguetes"],
                "sizes": ["Única"],
                "is_new": True,
                "features": ["10 modos de vibración", "Silicona médica", "Sumergible IPX7", "Carga USB"],
                "colors": [color_map["Rosa"], color_map["Negro"]]
            },
            {
                "name": "Huevo Vibrador Control Remoto",
                "description": "Discreto huevo vibrador con control remoto inalámbrico. Perfecto para juegos en pareja o uso individual.",
                "price": 75900,
                "images": ["/product-2.jpg"],
                "category_id": cat_map["Juguetes"],
                "sizes": ["Única"],
                "features": ["Control remoto inalámbrico", "Silencioso", "Alcance 10m", "Material suave"],
                "colors": [color_map["Rosa"], color_map["Lavanda"]]
            },
            {
                "name": "Anillo Vibrador Dual",
                "description": "Anillo vibrador elástico diseñado para el placer compartido. Vibraciones potentes y ajuste cómodo.",
                "price": 35900,
                "images": ["/product-3.jpg"],
                "category_id": cat_map["Juguetes"],
                "sizes": ["Ajustable"],
                "is_sale": True,
                "features": ["Vibración potente", "Elástico", "Pila incluida", "Texturizado"],
                "colors": [color_map["Negro"], color_map["Azul" if "Azul" in color_map else "Negro"]]
            },
            {
                "name": "Lubricante Base Agua Premium",
                "description": "Lubricante íntimo suave a base de agua, de larga duración y compatible con preservativos y juguetes.",
                "price": 28900,
                "images": ["/product-4.jpg"],
                "category_id": cat_map["Juguetes"],
                "sizes": ["100ml"],
                "features": ["Base agua", "Larga duración", "Sin aroma", "No mancha"],
                "colors": [color_map["Blanco"]]
            },
        ]

        for p_data in products:
            existing = db.query(models.Product).filter(models.Product.name == p_data["name"]).first()
            if not existing:
                p_colors = p_data.pop("colors")
                db_product = models.Product(**p_data)
                db_product.colors = p_colors
                db.add(db_product)
        
        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
