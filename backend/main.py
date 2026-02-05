from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import crud, models, schemas, os, uuid
from database import SessionLocal, engine

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sexshop Quibdo API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if not exists
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Mount static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/products", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, category: str = None, db: Session = Depends(get_db)):
    products = crud.get_products(db, skip=skip, limit=limit, category=category)
    return products

@app.get("/api/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.post("/api/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

@app.get("/api/categories", response_model=List[schemas.Category])
def read_categories(db: Session = Depends(get_db)):
    return crud.get_categories(db)

@app.get("/api/colors", response_model=List[schemas.Color])
def read_colors(db: Session = Depends(get_db)):
    return crud.get_colors(db)

@app.post("/api/record-visit")
def record_visit(request: Request, db: Session = Depends(get_db)):
    client_host = request.client.host
    crud.record_visit(db, ip_address=client_host)
    return {"status": "ok"}

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    return {"url": f"http://localhost:8000/uploads/{unique_filename}"}

@app.post("/api/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db=db, order=order)

@app.get("/api/orders/user/{user_id}", response_model=List[schemas.Order])
def read_user_orders(user_id: str, db: Session = Depends(get_db)):
    return crud.get_user_orders(db, user_id=user_id)

@app.get("/api/orders/{order_id}", response_model=schemas.Order)
def read_order(order_id: int, email: str, db: Session = Depends(get_db)):
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    if db_order.customer_email.lower() != email.lower():
        raise HTTPException(status_code=403, detail="No tienes permiso para ver este pedido")
    return db_order

# Admin Endpoints
@app.get("/api/admin/orders", response_model=List[schemas.Order])
def read_all_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_orders(db, skip=skip, limit=limit)

@app.patch("/api/admin/orders/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, status_update: dict, db: Session = Depends(get_db)):
    status = status_update.get("status")
    if not status:
        raise HTTPException(status_code=400, detail="Status is required")
    db_order = crud.update_order_status(db, order_id=order_id, status=status)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@app.put("/api/admin/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = crud.update_product(db, product_id=product_id, product=product)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.delete("/api/admin/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    success = crud.delete_product(db, product_id=product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@app.get("/api/admin/stats")
def read_admin_stats(db: Session = Depends(get_db)):
    return crud.get_admin_stats(db)

@app.get("/api/admin/users")
def read_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_users(db, skip=skip, limit=limit)

# Seed endpoint (for development)
@app.post("/api/seed")
def seed_data(db: Session = Depends(get_db)):
    # Add Categories
    categories = [
        "Conjuntos", "Bralettes", "Bodies", "Kimonos", 
        "Brasiers", "Panties", "Babydolls", "Corsets"
    ]
    for cat_name in categories:
        if not db.query(models.Category).filter(models.Category.name == cat_name).first():
            crud.create_category(db, schemas.CategoryCreate(name=cat_name))
    
    # Add Colors
    colors = [
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
    ]
    for color in colors:
        if not db.query(models.Color).filter(models.Color.name == color["name"]).first():
            crud.create_color(db, schemas.ColorCreate(**color))
            
    return {"message": "Categories and colors seeded successfully"}
