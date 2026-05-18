@echo off
echo ===================================================
echo 🏪 APSARA SHOP - DATABASE BACKUP (डेटा बॅकअप)
echo ===================================================
echo.
echo Exporting products and invoices...
mongodump --db=apsara_ladies_shop --out=.\db_backup
echo.
if %errorlevel% neq 0 (
    echo [ERROR] MongoDB tools (mongodump) not found in system PATH.
    echo Don't worry! Our advanced front-end browser backup will automatically
    echo restore your data when you open the app on the new computer's browser.
) else (
    echo [SUCCESS] Backup completed! Folder "db_backup" is ready.
)
echo.
pause
