@echo off
chcp 65001 > nul
title Git Commit & Push

:: 현재 배치파일 위치를 작업 폴더로 설정
cd /d "%~dp0"

echo ===================================
echo Git Pull
echo ===================================
git pull

echo.
echo ===================================
echo Git Add
echo ===================================
git add .

echo.
git log -1
set /p MSG=Commit message 입력 : 

if "%MSG%"=="" (
    set MSG=Update
)

echo.
echo ===================================
echo Git Commit
echo ===================================
git commit -m "%MSG%"

echo.
echo ===================================
echo Git Push
echo ===================================
git push

echo.
echo ===================================
echo Completed
echo ===================================

pause