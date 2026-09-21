@echo off
chcp 65001 > nul
title Git Log

cd /d "%~dp0"

set /p LOG_SIZE=Log Count (default: 5) :

if "%LOG_SIZE%"=="" set LOG_SIZE=5

git --no-pager log -%LOG_SIZE% ^
--pretty=format:"%%C(yellow)%%h%%Creset | %%C(green)%%ad%%Creset | %%C(cyan)%%an%%Creset | %%s" ^
--date=format:"%%Y-%%m-%%d %%H:%%M:%%S"

echo.
echo.
pause