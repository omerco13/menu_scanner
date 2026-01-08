import os
import base64
import pytesseract
from openai import OpenAI
from PIL import Image
from .image_service import preprocess_image


def extract_text_openai(image_path: str) -> str:
    """Use OpenAI Vision API for accurate text extraction"""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    with open(image_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """Extract all menu items from this image and organize them by category.

IMPORTANT RULES:
1. FIRST LINE: If there's a restaurant/cafe name at the top of the menu, put it as the FIRST LINE (no # prefix)
2. Read the menu from LEFT TO RIGHT, TOP TO BOTTOM (like reading a book)
3. Identify ALL categories - there are TWO types:
   - MAIN categories (large sections like "HOT DRINKS", "COLD DRINKS", "FOOD"): Mark with "##" prefix
   - SUB categories (smaller subsections like "tea", "extras", "alternative milk"): Mark with "#" prefix
4. If an item has multiple prices (different sizes), list ALL prices separated by " / " (e.g., $4.70 / $5.20)
5. Keep categories separate - don't merge them
6. Preserve the exact category names from the menu

Format your response as:
## MAIN CATEGORY NAME
Item Name - $X.XX
Item Name with Multiple Sizes - $X.XX / $Y.YY

# Sub Category Name
Item Name - $X.XX

## NEXT MAIN CATEGORY
Item Name - $X.XX

Use clear line breaks between categories."""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        max_tokens=2000
    )
    return response.choices[0].message.content


def extract_text_tesseract(image_path: str) -> str:
    """Extract text using Tesseract OCR"""
    image = preprocess_image(image_path)
    custom_config = r'--oem 3 --psm 6 -c preserve_interword_spaces=1'
    text = pytesseract.image_to_string(image, config=custom_config, lang='eng')
    return text
