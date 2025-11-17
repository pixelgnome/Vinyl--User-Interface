@echo off
REM Vinyl$ Project Migration Script for Windows
REM This script moves files from Figma Make structure to standard npm structure

echo.
echo 🎵 Vinyl$ Project Migration Script
echo ====================================
echo.

REM Create directory structure
echo 📁 Creating directory structure...
if not exist "src\components\ui" mkdir src\components\ui
if not exist "src\components\figma" mkdir src\components\figma
if not exist "src\utils" mkdir src\utils
if not exist "src\styles" mkdir src\styles
if not exist "public" mkdir public

REM Copy components
echo 📦 Copying components...
if exist "components" (
    for %%f in (components\*.tsx) do (
        echo   - %%~nxf
        copy "%%f" "src\components\" >nul
    )
)

REM Copy UI components
echo 📦 Copying UI components...
if exist "components\ui" (
    copy "components\ui\*.tsx" "src\components\ui\" >nul 2>&1
    copy "components\ui\*.ts" "src\components\ui\" >nul 2>&1
    echo   - Copied all UI components
)

REM Copy figma components
echo 📦 Copying Figma components...
if exist "components\figma" (
    copy "components\figma\*.tsx" "src\components\figma\" >nul 2>&1
    echo   - Copied Figma components
)

REM Copy utils
echo 📦 Copying utils...
if exist "utils\api.ts" (
    copy "utils\api.ts" "src\utils\" >nul
    echo   - api.ts
)

REM Copy styles
echo 📦 Copying styles...
if exist "styles\globals.css" (
    copy "styles\globals.css" "src\styles\" >nul
    echo   - globals.css
)

echo.
echo ✅ Migration complete!
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: npm run dev
echo 3. Open: http://localhost:5173
echo.
echo Happy collecting! 🎵
pause
