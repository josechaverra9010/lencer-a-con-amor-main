from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Table, JSON, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# Many-to-Many relationship table for Colors
product_colors = Table(
    "product_colors",
    Base.metadata,
    Column("product_id", Integer, ForeignKey("products.id")),
    Column("color_id", Integer, ForeignKey("colors.id"))
)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    products = relationship("Product", back_populates="category")

class Color(Base):
    __tablename__ = "colors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50))
    value = Column(String(20)) # Hex color

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    description = Column(String(500))
    price = Column(Float)
    original_price = Column(Float, nullable=True)
    images = Column(JSON) # List of image URLs
    category_id = Column(Integer, ForeignKey("categories.id"))
    sizes = Column(JSON) # List of sizes
    is_new = Column(Boolean, default=False)
    is_sale = Column(Boolean, default=False)
    features = Column(JSON) # List of features

    category = relationship("Category", back_populates="products")
    colors = relationship("Color", secondary=product_colors)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100))
    customer_email = Column(String(100))
    customer_phone = Column(String(20))
    address = Column(String(200))
    city = Column(String(100))
    total_amount = Column(Float)
    payment_method = Column(String(50)) # 'wompi' or 'cash'
    status = Column(String(50), default="pending") # 'pending', 'paid', 'delivered'
    created_at = Column(String(50)) # For simplicity, can be DateTime
    postal_code = Column(String(20), nullable=True)

    items = relationship("OrderItem", back_populates="order")
    user_id = Column(String(100), nullable=True)

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price = Column(Float)
    size = Column(String(20), nullable=True)
    color = Column(String(50), nullable=True)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    name = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

class Visitor(Base):
    __tablename__ = "visitors"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String(50))
    visit_date = Column(String(20)) # Format: YYYY-MM-DD
    timestamp = Column(DateTime, default=datetime.utcnow)
