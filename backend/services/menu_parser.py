import re
from models.menu import MenuData, MenuCategory, MenuItem


def parse_menu_text(text: str) -> MenuData:
    """Parse extracted text into structured menu data"""
    lines = [line.strip() for line in text.split('\n') if line.strip()]

    restaurant_name = None
    categories = []
    current_category = None
    current_is_main = True
    items = []

    # Pattern to find prices: either after dash or standalone with $
    # Supports both 1 and 2 decimal places (e.g., $4.7 or $4.70)
    dash_price_pattern = r'[\-\–\—]\s*\$?\s*(\d+)\.(\d{1,2})'
    standalone_price_pattern = r'\$\s*(\d+)\.(\d{1,2})'

    for i, line in enumerate(lines):
        if len(line) < 2:
            continue

        if i == 0 and not re.search(r'\d', line) and not line.startswith('#'):
            restaurant_name = line
            continue

        # Check for category markers: ##, ###, or #
        if line.startswith('#'):
            # Count the number of # symbols
            hash_count = len(line) - len(line.lstrip('#'))
            new_is_main = (hash_count == 2)

            # Save previous category if it has items OR if it's a main category (acts as section header)
            if current_category and (items or current_is_main):
                categories.append(MenuCategory(
                    name=current_category,
                    items=items if items else [],
                    is_main=current_is_main
                ))
                items = []

            # Extract category name
            current_category = line.lstrip('#').strip()
            current_is_main = new_is_main
            continue

        if line.isupper() and len(line) > 3 and not re.search(dash_price_pattern, line):
            if items and current_category:
                categories.append(MenuCategory(
                    name=current_category,
                    items=items,
                    is_main=current_is_main
                ))
                items = []
            current_category = line.title()
            current_is_main = True
            continue

        # Find all prices (both dash-prefixed and standalone)
        price_matches = list(re.finditer(standalone_price_pattern, line))

        if price_matches:
            # Format prices with 2 decimal places (pad with 0 if needed)
            prices = [f"${m.group(1)}.{m.group(2).ljust(2, '0')}" for m in price_matches]
            price = " / ".join(prices)

            first_price_pos = price_matches[0].start()
            item_name = line[:first_price_pos].strip()
            item_name = re.sub(r'[\-\–\—]+$', '', item_name).strip()

            if item_name and len(item_name) > 1:
                items.append(MenuItem(
                    name=item_name,
                    price=price,
                    description=""
                ))

    if items and current_category:
        categories.append(MenuCategory(
            name=current_category,
            items=items,
            is_main=current_is_main
        ))

    return MenuData(
        restaurant_name=restaurant_name,
        categories=categories
    )
