@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if not errorlevel 1 (
  start "EduPlay - servidor" /min py -3 server.py
  goto esperar
)

where python >nul 2>nul
if not errorlevel 1 (
  start "EduPlay - servidor" /min python server.py
  goto esperar
)

echo EduPlay necesita Python 3 para iniciar el servidor local.
echo Instala Python 3 y vuelve a abrir este archivo.
pause
exit /b 1

:esperar
for /l %%i in (1,1,12) do (
  powershell -NoProfile -Command "try { Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/setup-status' -TimeoutSec 1 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>nul
  if not errorlevel 1 goto abrir
  timeout /t 1 /nobreak >nul
)
echo EduPlay no pudo iniciar. Revisa que Python 3 este instalado y que el puerto 8000 este disponible.
pause
exit /b 1

:abrir
start "" "http://127.0.0.1:8000/"
echo EduPlay esta abierto en tu navegador.
echo Mantén activa la ventana minimizada "EduPlay - servidor" mientras utilizas la app.
endlocal
