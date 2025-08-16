@echo off
echo ========================================
echo   Quick Cloudflare Tunnel
echo ========================================
echo.

REM Replace this IP with your actual ECS IP
set ECS_IP=54.82.232.68

echo Starting tunnel for: http://%ECS_IP%:8000
echo.
echo ========================================
echo   COPY THE HTTPS URL THAT APPEARS BELOW
echo ========================================
echo.

cloudflared tunnel --url http://%ECS_IP%:8000