from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class MenuDB(Base):
    """Database model for Menu"""
    __tablename__ = "menus"

    id = Column(String, primary_key=True, index=True)
    restaurant_name = Column(String, nullable=True)
    raw_text = Column(String)
    image_path = Column(String)
    original_filename = Column(String, nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    categories = relationship("CategoryDB", back_populates="menu", cascade="all, delete-orphan")


class CategoryDB(Base):
    """Database model for Menu Category"""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    is_main = Column(Boolean, default=True)
    menu_id = Column(String, ForeignKey("menus.id"))

    # Relationships
    menu = relationship("MenuDB", back_populates="categories")
    items = relationship("MenuItemDB", back_populates="category", cascade="all, delete-orphan")


class MenuItemDB(Base):
    """Database model for Menu Item"""
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    price = Column(String, nullable=False)
    description = Column(String, default="")
    category_id = Column(Integer, ForeignKey("categories.id"))

    # Relationship
    category = relationship("CategoryDB", back_populates="items")
