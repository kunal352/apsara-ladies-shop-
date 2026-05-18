@echo off
echo ===================================================
echo 🏪 APSARA SHOP - DATABASE RESTORE (डेटा रिस्टोर)
echo ===================================================
echo.
if not exist .\db_backup\apsara_ladies_shop (
    echo [ERROR] Backup folder "db_backup" not found!
    echo Please run "backup_data.bat" on the original computer first.
    echo.
    pause
    exit /b
)
echo.
echo Importing products and invoices to MongoDB...
mongorestore --db=apsara_ladies_shop .\db_backup\apsara_ladies_shop
echo.
if %errorlevel% neq 0 (
    echo [ERROR] MongoDB tools (mongorestore) not found in system PATH.
    echo Don't worry! Our front-end auto-sync will populate the database
    echo automatically when you load the page in the browser!
) else (
    echo [SUCCESS] Data restored successfully on the new computer!
)
echo.
pause
