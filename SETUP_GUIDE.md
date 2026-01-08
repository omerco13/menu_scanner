# Setup Guide - Improving OCR Results

## The Problem

Tesseract OCR alone often produces poor results with menu images, leading to:
- Incorrect price formatting (4752 instead of $4.75)
- Missing decimal points
- Poor separation of items
- Misread text

## The Solution

I've implemented **two approaches** to improve results:

### Option 1: OpenAI Vision API (RECOMMENDED)

This provides **dramatically better** results and is now the default setting.

**Pros:**
- Excellent accuracy
- Proper price formatting
- Understands menu structure
- Works with various image qualities

**Cons:**
- Requires API key (costs ~$0.01-0.05 per image)
- Needs internet connection

**Setup:**

1. Get an OpenAI API key:
   - Go to https://platform.openai.com/api-keys
   - Create account if needed
   - Click "Create new secret key"
   - Copy the key

2. Create `.env` file in backend directory:
   ```bash
   cd backend
   cp .env.example .env
   ```

3. Edit `.env` and add your key:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Restart the backend server

**That's it!** The code is already configured to use OpenAI Vision by default.

### Option 2: Enhanced Tesseract (FREE but less accurate)

If you don't want to use OpenAI, I've improved Tesseract with:
- Image preprocessing (grayscale, thresholding, denoising)
- Better regex patterns for price detection
- Smarter parsing logic

**Setup:**

1. In `backend/services/menu_processor.py`, change line 18:
   ```python
   self.use_openai = False  # Use Tesseract instead
   ```

2. Make sure Tesseract is installed:
   - Windows: https://github.com/UB-Mannheim/tesseract/wiki
   - Mac: `brew install tesseract`
   - Linux: `sudo apt-get install tesseract-ocr`

## What I Changed

### 1. Image Preprocessing (for Tesseract)
```python
def preprocess_image(self, image_path: str) -> Image:
    # Convert to grayscale
    # Apply adaptive thresholding
    # Denoise the image
    # Returns cleaner image for OCR
```

### 2. OpenAI Vision Integration
- Sends image to GPT-4 Vision
- Asks it to extract menu items in structured format
- Gets back properly formatted text

### 3. Improved Price Parsing
Now handles multiple price formats:
- `$4.75` - standard format
- `4.75` - missing dollar sign
- `4 75` - space instead of decimal
- `475` - missing decimal entirely
- Converts all to proper `$X.XX` format

### 4. Better Category Detection
- Recognizes UPPERCASE headers as categories
- Groups items under correct categories
- Handles menus with or without categories

### 5. Smarter Item Extraction
- Finds the LAST price in a line (the actual price)
- Cleans up item names
- Removes trailing punctuation
- Detects descriptions

## Testing

Try uploading your menu again:

**With OpenAI Vision**, you should get results like:
```
HOT DRINKS
Cappuccino - $4.75
Latte - $4.75
Flat White - $4.75

COLD DRINKS
Iced Coffee - $8.00
Iced Chocolate - $8.00
```

**With Tesseract** (improved but still imperfect):
```
Hot Drinks
Cappuccino - $4.75
Latte - $4.78
```

## Cost Considerations

**OpenAI Vision:**
- ~$0.01-0.05 per menu image
- For 100 menus = $1-5
- Production apps should monitor usage

**Tesseract:**
- Completely free
- No API limits
- But less accurate

## Switching Between Methods

In [menu_processor.py](backend/services/menu_processor.py):

```python
class MenuProcessor:
    def __init__(self):
        self.use_openai = True   # OpenAI Vision (recommended)
        # self.use_openai = False  # Tesseract (free)
```

## Troubleshooting

**"OpenAI package not installed"**
```bash
pip install openai
```

**"OpenAI Vision API failed"**
- Check your API key is correct in `.env`
- Make sure you have credits in your OpenAI account
- Verify the `.env` file is in the `backend` directory

**"No module named 'cv2'"**
```bash
pip install opencv-python
```

**Still getting bad results with Tesseract?**
- Try higher resolution images
- Ensure good lighting and contrast
- Consider using OpenAI Vision instead

## Next Steps

1. **Try OpenAI Vision** - Follow Option 1 setup above
2. **Upload the same menu** - Compare results
3. **Adjust parsing** - If needed, tweak the regex in `parse_menu_text()`

The parsing logic is highly customizable in [menu_processor.py:133-219](backend/services/menu_processor.py).
