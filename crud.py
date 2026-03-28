from sqlalchemy.orm import Session
import models, schemas

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def update_product(db: Session, product_id: int, product: schemas.ProductCreate):
    db_product = get_product(db, product_id)
    if db_product:
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.original_price = product.original_price
        db_product.images = product.images
        db_product.category_id = product.category_id
        db_product.sizes = product.sizes
        db_product.is_new = product.is_new
        db_product.is_sale = product.is_sale
        db_product.features = product.features
        
        # Always update colors, even if color_ids is an empty list
        colors = db.query(models.Color).filter(models.Color.id.in_(product.color_ids)).all()
        db_product.colors = colors
            
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False

def get_products(db: Session, skip: int = 0, limit: int = 100, category: str = None):
    query = db.query(models.Product)
    if category and category != "Todos":
        query = query.join(models.Category).filter(models.Category.name == category)
    return query.offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        original_price=product.original_price,
        images=product.images,
        category_id=product.category_id,
        sizes=product.sizes,
        is_new=product.is_new,
        is_sale=product.is_sale,
        features=product.features
    )
    if product.color_ids:
        colors = db.query(models.Color).filter(models.Color.id.in_(product.color_ids)).all()
        db_product.colors = colors
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

from datetime import datetime

def create_order(db: Session, order: schemas.OrderCreate):
    db_order = models.Order(
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        address=order.address,
        city=order.city,
        postal_code=order.postal_code,
        total_amount=order.total_amount,
        payment_method=order.payment_method,
        user_id=order.user_id,
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price,
            size=item.size,
            color=item.color
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def get_user_orders(db: Session, user_id: str):
    return db.query(models.Order).filter(models.Order.user_id == user_id).order_by(models.Order.created_at.desc()).all()

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def get_all_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()

def update_order_status(db: Session, order_id: int, status: str):
    db_order = get_order(db, order_id)
    if db_order:
        db_order.status = status
        db.commit()
        db.refresh(db_order)
    return db_order

def create_color(db: Session, color: schemas.CategoryCreate):
    db_color = models.Color(name=color.name, value=color.value)
    db.add(db_color)
    db.commit()
    db.refresh(db_color)
    return db_color

def record_visit(db: Session, ip_address: str):
    today = datetime.now().strftime("%Y-%m-%d")
    # Check if this IP already visited today
    existing_visit = db.query(models.Visitor).filter(
        models.Visitor.ip_address == ip_address,
        models.Visitor.visit_date == today
    ).first()
    
    if not existing_visit:
        db_visitor = models.Visitor(ip_address=ip_address, visit_date=today)
        db.add(db_visitor)
        db.commit()
        db.refresh(db_visitor)
        return True
    return False

def get_admin_stats(db: Session):
    total_sales = db.query(models.Order).with_entities(models.Order.total_amount).filter(models.Order.status != 'cancelled').all()
    revenue = sum([s[0] for s in total_sales])
    orders_count = db.query(models.Order).count()
    products_count = db.query(models.Product).count()
    
    # Unique visitors count
    visitors_count = db.query(models.Visitor).count()
    
    # Get recent orders
    recent_orders = db.query(models.Order).order_by(models.Order.created_at.desc()).limit(5).all()
    
    # Calculate sales activity (simplified monthly revenue for the current year)
    # In a real app, this would use SQL grouping, but for SQLite/Small data we can do it in Python
    sales_activity = [0] * 12
    current_year = datetime.now().year
    
    all_orders = db.query(models.Order).filter(models.Order.status != 'cancelled').all()
    for order in all_orders:
        try:
            # order.created_at format: "%Y-%m-%d %H:%M:%S"
            dt = datetime.strptime(order.created_at, "%Y-%m-%d %H:%M:%S")
            if dt.year == current_year:
                sales_activity[dt.month - 1] += order.total_amount
        except:
            continue
            
    return {
        "revenue": revenue,
        "orders_count": orders_count,
        "products_count": products_count,
        "visitors_count": visitors_count,
        "recent_orders": recent_orders,
        "sales_activity": sales_activity
    }

def get_categories(db: Session):
    return db.query(models.Category).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_colors(db: Session):
    return db.query(models.Color).all()

def create_color(db: Session, color: schemas.ColorCreate):
    db_color = models.Color(name=color.name, value=color.value)
    db.add(db_color)
    db.commit()
    db.refresh(db_color)
    return db_color

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).order_by(models.User.created_at.desc()).offset(skip).limit(limit).all()
