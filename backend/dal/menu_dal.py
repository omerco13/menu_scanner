"""
Data Access Layer (DAL) for Menu operations.
This layer only handles direct database queries - no business logic.
"""

from sqlalchemy.orm import Session
from models.database import MenuDB, CategoryDB, MenuItemDB
from typing import List, Optional


class MenuDAL:
    """Data Access Layer for Menu database operations"""

    @staticmethod
    def create_menu(db: Session, menu_id: str, restaurant_name: str, raw_text: str, image_path: str, original_filename: str = None) -> MenuDB:
        """
        Insert a new menu record into the database.

        Args:
            db: Database session
            menu_id: Unique menu identifier
            restaurant_name: Name of the restaurant
            raw_text: Original OCR text
            image_path: Path to uploaded image
            original_filename: Original filename of the uploaded file

        Returns:
            MenuDB: Created menu object
        """
        db_menu = MenuDB(
            id=menu_id,
            restaurant_name=restaurant_name,
            raw_text=raw_text,
            image_path=image_path,
            original_filename=original_filename
        )
        db.add(db_menu)
        db.commit()
        db.refresh(db_menu)
        return db_menu

    @staticmethod
    def create_category(db: Session, name: str, is_main: bool, menu_id: str) -> CategoryDB:
        """
        Insert a new category record into the database.

        Args:
            db: Database session
            name: Category name
            is_main: Whether this is a main category
            menu_id: ID of the parent menu

        Returns:
            CategoryDB: Created category object
        """
        db_category = CategoryDB(
            name=name,
            is_main=is_main,
            menu_id=menu_id
        )
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category

    @staticmethod
    def create_menu_item(db: Session, name: str, price: str, description: str, category_id: int) -> MenuItemDB:
        """
        Insert a new menu item record into the database.

        Args:
            db: Database session
            name: Item name
            price: Item price
            description: Item description
            category_id: ID of the parent category

        Returns:
            MenuItemDB: Created menu item object
        """
        db_item = MenuItemDB(
            name=name,
            price=price,
            description=description,
            category_id=category_id
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    @staticmethod
    def get_menu_by_id(db: Session, menu_id: str) -> Optional[MenuDB]:
        """
        Retrieve a menu by ID.

        Args:
            db: Database session
            menu_id: Menu ID to retrieve

        Returns:
            MenuDB or None if not found
        """
        return db.query(MenuDB).filter(MenuDB.id == menu_id).first()

    @staticmethod
    def get_all_menus(db: Session, skip: int = 0, limit: int = 100) -> List[MenuDB]:
        """
        Retrieve all menus with pagination.

        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List of MenuDB objects
        """
        return db.query(MenuDB).offset(skip).limit(limit).all()

    @staticmethod
    def delete_menu(db: Session, menu_id: str) -> bool:
        """
        Delete a menu by ID.

        Args:
            db: Database session
            menu_id: Menu ID to delete

        Returns:
            True if deleted, False if not found
        """
        db_menu = db.query(MenuDB).filter(MenuDB.id == menu_id).first()
        if not db_menu:
            return False

        db.delete(db_menu)
        db.commit()
        return True

    @staticmethod
    def count_menus(db: Session) -> int:
        """
        Count total number of menus.

        Args:
            db: Database session

        Returns:
            Total count of menus
        """
        return db.query(MenuDB).count()

    @staticmethod
    def get_menu_by_filename(db: Session, original_filename: str) -> Optional[MenuDB]:
        """
        Check if a menu with the given original filename exists.

        Args:
            db: Database session
            original_filename: Original filename to check

        Returns:
            MenuDB or None if not found
        """
        return db.query(MenuDB).filter(MenuDB.original_filename == original_filename).first()
