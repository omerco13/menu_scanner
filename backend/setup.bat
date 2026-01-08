@echo off
echo ============================================
echo Menu Scanner Backend Setup
echo ============================================
echo.

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo ============================================
echo Setup complete!
echo ============================================
echo.
echo IMPORTANT: To use OpenAI Vision (recommended):
echo 1. Copy .env.example to .env
echo 2. Add your OpenAI API key to .env
echo 3. Get a key from: https://platform.openai.com/api-keys
echo.
echo To start the server, run:
echo   python main.py
echo.
pause
