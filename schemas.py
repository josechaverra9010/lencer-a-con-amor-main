from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class ColorBase(BaseModel):
    name: str
    value: str

class ColorCreate(ColorBase):
    pass

class Color(ColorBase):
    id: int
    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    images: List[str]
    sizes: List[str]
    is_new: bool = False
    is_sale: bool = False
    features: List[str] = []

class ProductCreate(ProductBase):
    category_id: int
    color_ids: List[int] = []

class Product(ProductBase):
    id: int
    category_id: int
    category: Category
    colors: List[Color]

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float
    size: Optional[str] = None
    color: Optional[str] = None

class OrderItem(OrderItemBase):
    id: int
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    address: str
    city: str
    postal_code: str
    total_amount: float
    payment_method: str
    user_id: Optional[str] = None
    items: List[OrderItemBase]

class Order(OrderCreate):
    id: int
    status: str
    created_at: str
    postal_code: Optional[str] = None
    user_id: Optional[str] = None
    items: List[OrderItem]

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
