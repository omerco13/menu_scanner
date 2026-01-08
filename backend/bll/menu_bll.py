"""
Business Logic Layer (BLL) for Menu operations.
This layer contains business logic and uses DAL for database operations.
"""

from sqlalchemy.orm import Session
from dal.menu_dal import MenuDAL
from models.menu import MenuData, MenuCategory, MenuItem
from typing import List, Optional


class MenuBLL:
    """Business Logic Layer for Menu operations"""

    def __init__(self, db: Session):
        """
        Initialize BLL with database session.

        Args:
            db: Database session
        """
        self.db = db
        self.dal = MenuDAL()

    def save_menu(self, menu_data: MenuData, menu_id: str, image_path: str, raw_text: str, original_filename: str = None) -> dict:
        """
        Save a processed menu to the database.
        This coordinates multiple DAL operations and adds business logic.

        Args:
            menu_data: Parsed menu data (MenuData object)
            menu_id: Unique ID for the menu
            image_path: Path to the uploaded image file
            raw_text: Original OCR extracted text
            original_filename: Original filename of the uploaded file

        Returns:
            Dictionary with menu summary
        """
        # Business logic: Validate restaurant name
        restaurant_name = menu_data.restaurant_name
        if not restaurant_name or restaurant_name.strip() == "":
            restaurant_name = "Unknown Restaurant"

        # Create menu record using DAL
        db_menu = self.dal.create_menu(
            db=self.db,
            menu_id=menu_id,
            restaurant_name=restaurant_name,
            raw_text=raw_text,
            image_path=image_path,
            original_filename=original_filename
        )

        # Create categories and items
        for category in menu_data.categories:
            # Create category using DAL
            db_category = self.dal.create_category(
                db=self.db,
                name=category.name,
                is_main=category.is_main,
                menu_id=menu_id
            )

            # Create items for this category using DAL
            for item in category.items:
                self.dal.create_menu_item(
                    db=self.db,
                    name=item.name,
                    price=item.price,
                    description=item.description or "",
                    category_id=db_category.id
                )

        # Return summary
        return {
            "id": db_menu.id,
            "restaurant_name": db_menu.restaurant_name,
            "created_at": db_menu.created_at.isoformat()
        }

    def get_menu(self, menu_id: str) -> Optional[MenuData]:
        """
        Retrieve a menu by ID and convert to MenuData format.

        Args:
            menu_id: The menu ID to retrieve

        Returns:
            MenuData or None if not found
        """
        # Get menu from DAL
        db_menu = self.dal.get_menu_by_id(self.db, menu_id)

        if not db_menu:
            return None

        # Business logic: Convert database objects to Pydantic models
        categories = []
        for db_category in db_menu.categories:
            items = [
                MenuItem(
                    name=db_item.name,
                    price=db_item.price,
                    description=db_item.description
                )
                for db_item in db_category.items
            ]

            categories.append(MenuCategory(
                name=db_category.name,
                items=items,
                is_main=db_category.is_main
            ))

        return MenuData(
            restaurant_name=db_menu.restaurant_name,
            categories=categories
        )

    def list_menus(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """
        Get a list of all saved menus (summary only).

        Args:
            skip: Number of records to skip (for pagination)
            limit: Maximum number of records to return

        Returns:
            List of menu summaries
        """
        # Business logic: Validate pagination parameters
        if skip < 0:
            skip = 0
        if limit < 1 or limit > 100:
            limit = 100

        # Get menus from DAL
        menus = self.dal.get_all_menus(self.db, skip, limit)

        # Return formatted summaries
        return [
            {
                "id": menu.id,
                "restaurant_name": menu.restaurant_name,
                "created_at": menu.created_at.isoformat(),
                "image_path": menu.image_path
            }
            for menu in menus
        ]

    def delete_menu(self, menu_id: str) -> bool:
        """
        Delete a menu by ID.

        Args:
            menu_id: The menu ID to delete

        Returns:
            True if deleted, False if not found
        """
        # Business logic: Could add authorization check here
        # For now, just pass through to DAL
        return self.dal.delete_menu(self.db, menu_id)

    def get_menu_count(self) -> int:
        """
        Get total number of saved menus.

        Returns:
            Total count of menus
        """
        return self.dal.count_menus(self.db)

    def check_filename_exists(self, original_filename: str) -> bool:
        """
        Check if a menu with the given original filename already exists.

        Args:
            original_filename: Original filename to check

        Returns:
            True if filename exists, False otherwise
        """
        existing_menu = self.dal.get_menu_by_filename(self.db, original_filename)
        return existing_menu is not None
