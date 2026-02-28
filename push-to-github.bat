@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Git baslatiliyor...
if not exist .git git init

echo Remote ekleniyor...
git remote remove origin 2>nul
git remote add origin https://github.com/enbayy/rekanaliz.git

echo Dosyalar ekleniyor...
git add .

echo Commit atiliyor...
git commit -m "Initial commit" 2>nul || git commit -m "Guncelleme"

echo Ana dal: main
git branch -M main

echo GitHub'a push ediliyor...
git push -u origin main

echo.
echo Tamamlandi.
pause
