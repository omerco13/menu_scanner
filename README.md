# Menu Scanner

A full-stack application that uses OCR to scan menu images and generates a beautiful web interface for displaying menu items.

## Features

- **Image Upload**: Drag & drop or click to upload menu images
- **Advanced OCR**: Uses OpenAI Vision API (recommended) or enhanced Tesseract OCR
- **Smart Parsing**: Automatically identifies menu items, prices, and categories
- **Price Formatting**: Converts various price formats (4752, 4.75, $4.75) to proper $X.XX format
- **Image Preprocessing**: Enhanced contrast, denoising, and grayscale conversion for better OCR
- **Beautiful Display**: Generates a responsive, styled menu website
- **FastAPI Backend**: High-performance Python backend
- **Next.js Frontend**: Modern React-based frontend with TypeScript

## Tech Stack

### Backend
- FastAPI
- Python 3.8+
- Tesseract OCR / OpenAI Vision API
- Pillow (PIL)

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios

## Project Structure

```
project3/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── services/
│   │   └── menu_processor.py  # Menu OCR and parsing logic
│   ├── requirements.txt
│   └── uploads/             # Uploaded images (created automatically)
│
└── frontend/
    ├── app/
    │   ├── page.tsx         # Main page
    │   ├── layout.tsx       # Root layout
    │   └── globals.css      # Global styles
    ├── components/
    │   ├── MenuUpload.tsx   # Upload component
    │   └── MenuDisplay.tsx  # Menu display component
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Install Tesseract OCR:
   - **Windows**: Download from https://github.com/UB-Mannheim/tesseract/wiki
   - **Mac**: `brew install tesseract`
   - **Linux**: `sudo apt-get install tesseract-ocr`

6. (Optional) For OpenAI Vision API:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key
   - Set `use_openai = True` in `menu_processor.py`

7. Run the server:
   ```bash
   python main.py
   ```

   Or with uvicorn:
   ```bash
   uvicorn main:app --reload
   ```

Backend will be available at: http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Frontend will be available at: http://localhost:3000

## Usage

1. Start both the backend and frontend servers
2. Open http://localhost:3000 in your browser
3. Upload a menu image (drag & drop or click to browse)
4. Click "Process Menu" to scan and extract menu data
5. View the generated menu website

## API Endpoints

### POST /api/upload-menu
Upload a menu image and get structured menu data.

**Request:**
- Content-Type: multipart/form-data
- Body: image file

**Response:**
```json
{
  "menu_id": "uuid",
  "restaurant_name": "Restaurant Name",
  "categories": [
    {
      "name": "Category Name",
      "items": [
        {
          "name": "Item Name",
          "price": "$10.99",
          "description": "Item description"
        }
      ]
    }
  ],
  "raw_text": "Full extracted text..."
}
```

## Configuration

### Using OpenAI Vision API (Better Accuracy)

If you want better OCR accuracy, you can use OpenAI's Vision API:

1. Get an API key from https://platform.openai.com
2. Create a `.env` file in the backend directory:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
3. In `backend/services/menu_processor.py`, set:
   ```python
   self.use_openai = True
   ```
4. Uncomment the OpenAI code sections in the file

## Customization

### Frontend Styling
- Modify `frontend/app/globals.css` for global styles
- Edit components in `frontend/components/` to change UI layout
- Tailwind classes can be adjusted in any component

### Menu Parsing Logic
- Edit `backend/services/menu_processor.py`
- The `parse_menu_text()` method contains the parsing logic
- Adjust regex patterns and parsing rules as needed

## Troubleshooting

**Tesseract not found:**
- Make sure Tesseract is installed and in your PATH
- On Windows, you may need to set the path in `.env`:
  ```
  TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe
  ```

**CORS errors:**
- Make sure backend is running on port 8000
- Check CORS settings in `backend/main.py`

**OCR accuracy issues:**
- Try using higher resolution images
- Ensure good lighting and contrast in the menu photo
- Consider using OpenAI Vision API for better results

## Future Enhancements

- [ ] Database integration for storing processed menus
- [ ] User authentication
- [ ] Custom styling options for generated menus
- [ ] Multi-language support
- [ ] Export menu to PDF/JSON
- [ ] Menu editor for correcting OCR errors
- [ ] QR code generation for menu sharing

## License

MIT
