from pydantic import BaseModel
from typing import List, Optional


class MenuItem(BaseModel):
    name: str
    price: str
    description: Optional[str] = ""


class MenuCategory(BaseModel):
    name: str
    items: List[MenuItem]
    is_main: bool = True


class MenuData(BaseModel):
    restaurant_name: Optional[str] = None
    categories: List[MenuCategory]


class MenuResponse(BaseModel):
    menu_id: str
    restaurant_name: Optional[str]
    categories: List[MenuCategory]
    raw_text: str
