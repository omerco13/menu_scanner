from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import traceback
import uuid
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from models.menu import MenuResponse
from services import extract_text_openai, extract_text_tesseract, parse_menu_text
from database import Base, engine, get_db
from bll.menu_bll import MenuBLL

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Menu Scanner API")

# Configure CORS for local development and production
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

# Add production frontend URL from environment variable
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    # Remove trailing slash if present
    frontend_url = frontend_url.rstrip("/")
    allowed_origins.append(frontend_url)
    print(f"Added CORS origin: {frontend_url}")

print(f"Allowed CORS origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

USE_OPENAI = bool(os.getenv("OPENAI_API_KEY"))


@app.get("/")
async def root():
    return {"message": f"Menu Scanner API is running (Using: {'OpenAI Vision' if USE_OPENAI else 'Tesseract OCR'})"}


@app.post("/api/upload-menu", response_model=MenuResponse)
async def upload_menu(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        contents = await file.read()

        # Generate unique menu ID and filename
        menu_id = str(uuid.uuid4())
        file_extension = Path(file.filename).suffix
        safe_filename = f"{menu_id}{file_extension}"
        file_path = UPLOAD_DIR / safe_filename

        # Save uploaded image
        with open(file_path, "wb") as f:
            f.write(contents)

        # Extract text using OCR
        if USE_OPENAI:
            raw_text = extract_text_openai(str(file_path))
        else:
            raw_text = extract_text_tesseract(str(file_path))

        # Parse menu text
        parsed_data = parse_menu_text(raw_text)

        # Save to database using BLL
        bll = MenuBLL(db)
        bll.save_menu(
            menu_data=parsed_data,
            menu_id=menu_id,
            image_path=str(file_path),
            raw_text=raw_text,
            original_filename=file.filename
        )

        return MenuResponse(
            menu_id=menu_id,
            restaurant_name=parsed_data.restaurant_name,
            categories=parsed_data.categories,
            raw_text=raw_text
        )

    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/api/check-filename/{filename}")
async def check_filename(filename: str, db: Session = Depends(get_db)):
    """
    Check if a menu with the given filename already exists.

    Args:
        filename: Original filename to check
        db: Database session

    Returns:
        {"exists": true/false}
    """
    try:
        bll = MenuBLL(db)
        exists = bll.check_filename_exists(filename)
        return {"exists": exists}
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/api/menus")
async def list_menus(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get a list of all saved menus.

    Args:
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return (max 100)
        db: Database session

    Returns:
        List of menu summaries
    """
    try:
        bll = MenuBLL(db)
        menus = bll.list_menus(skip=skip, limit=limit)
        return {"menus": menus, "total": len(menus)}
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/api/menus/{menu_id}", response_model=MenuResponse)
async def get_menu(menu_id: str, db: Session = Depends(get_db)):
    """
    Get a specific menu by ID.

    Args:
        menu_id: The menu ID to retrieve
        db: Database session

    Returns:
        Full menu data with all categories and items
    """
    try:
        bll = MenuBLL(db)
        menu_data = bll.get_menu(menu_id)

        if not menu_data:
            raise HTTPException(status_code=404, detail="Menu not found")

        return MenuResponse(
            menu_id=menu_id,
            restaurant_name=menu_data.restaurant_name,
            categories=menu_data.categories,
            raw_text=""  # We don't return raw_text for GET requests
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.delete("/api/menus/{menu_id}")
async def delete_menu(menu_id: str, db: Session = Depends(get_db)):
    """
    Delete a menu by ID.

    Args:
        menu_id: The menu ID to delete
        db: Database session

    Returns:
        Success message
    """
    try:
        bll = MenuBLL(db)
        success = bll.delete_menu(menu_id)

        if not success:
            raise HTTPException(status_code=404, detail="Menu not found")

        return {"message": "Menu deleted successfully", "menu_id": menu_id}
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
