# ============================================================================
# Script Helper - Obtener URL de Aplicación en Railway
# ============================================================================
# Este script te ayuda a encontrar la URL pública de tu app en Railway
# ============================================================================

Write-Host "🔍 Buscando URL de tu aplicación en Railway..." -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Verificar Railway CLI
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "❌ Railway CLI no encontrado" -ForegroundColor Red
    Write-Host "   Instalar con: npm install -g @railway/cli" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Railway CLI encontrado" -ForegroundColor Green

# Verificar que esté linkado
Write-Host "`n📡 Verificando proyecto linkado..." -ForegroundColor Yellow
$status = railway status 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No hay proyecto linkado" -ForegroundColor Red
    Write-Host "   Ejecutar: railway link" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Proyecto linkado" -ForegroundColor Green

# Obtener información del servicio
Write-Host "`n🔍 Obteniendo información del servicio..." -ForegroundColor Cyan
Write-Host "   (Esto puede tomar unos segundos...)" -ForegroundColor Gray
Write-Host ""

# Ejecutar railway status y capturar output
$statusOutput = railway status 2>&1 | Out-String

# Mostrar información del proyecto
Write-Host $statusOutput

# Instrucciones para encontrar la URL
Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "🌐 CÓMO ENCONTRAR TU URL PÚBLICA" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

Write-Host "`n📍 Método 1: Railway Dashboard (Recomendado)" -ForegroundColor Yellow
Write-Host "   1. Ve a: https://railway.app/dashboard" -ForegroundColor White
Write-Host "   2. Selecciona tu proyecto 'Sindicato'" -ForegroundColor White
Write-Host "   3. Clic en el servicio 'backend' o 'web'" -ForegroundColor White
Write-Host "   4. En la parte superior verás la URL pública:" -ForegroundColor White
Write-Host "      Ejemplo: https://sindescol-production.up.railway.app" -ForegroundColor Green
Write-Host "      O: https://backend-production-xxxx.up.railway.app" -ForegroundColor Green

Write-Host "`n📍 Método 2: Railway CLI" -ForegroundColor Yellow
Write-Host "   Ejecutar: railway domain" -ForegroundColor White
Write-Host "   (Esto generará/mostrará tu dominio público)" -ForegroundColor Gray

Write-Host "`n📍 Método 3: Generar dominio si no existe" -ForegroundColor Yellow
Write-Host "   Si no tienes dominio público configurado:" -ForegroundColor Gray
Write-Host "   1. Railway Dashboard → tu servicio" -ForegroundColor White
Write-Host "   2. Pestaña 'Settings'" -ForegroundColor White
Write-Host "   3. Sección 'Networking' → 'Generate Domain'" -ForegroundColor White

Write-Host "`n⚠️  IMPORTANTE: La URL correcta se ve así:" -ForegroundColor Yellow
Write-Host "   ✅ CORRECTO: https://tu-app.up.railway.app" -ForegroundColor Green
Write-Host "   ✅ CORRECTO: https://backend-production-abc123.up.railway.app" -ForegroundColor Green
Write-Host "   ❌ INCORRECTO: https://railway.com/project/..." -ForegroundColor Red
Write-Host "   (La URL de dashboard NO es la URL de tu app)" -ForegroundColor Gray

# Intentar obtener dominio con railway CLI
Write-Host "`n🔄 Intentando obtener dominio automáticamente..." -ForegroundColor Cyan

try {
    $domain = railway domain 2>&1
    if ($domain -match "https://") {
        Write-Host "`n✅ ¡Dominio encontrado!" -ForegroundColor Green
        Write-Host "   $domain" -ForegroundColor White
        Write-Host ""
        Write-Host "🚀 Usa esta URL para verificar deployment:" -ForegroundColor Cyan
        Write-Host "   .\scripts\verify-deployment.ps1 -AppUrl `"$domain`"" -ForegroundColor White
    } else {
        Write-Host "`n⚠️  No se pudo obtener dominio automáticamente" -ForegroundColor Yellow
        Write-Host "   Usa los métodos manuales arriba" -ForegroundColor Gray
    }
} catch {
    Write-Host "`n⚠️  No se pudo obtener dominio con Railway CLI" -ForegroundColor Yellow
    Write-Host "   Usa Railway Dashboard (Método 1)" -ForegroundColor Gray
}

Write-Host "`n📚 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Obtener URL pública con uno de los métodos arriba" -ForegroundColor White
Write-Host "   2. Verificar deployment:" -ForegroundColor White
Write-Host "      .\scripts\verify-deployment.ps1 -AppUrl `"https://tu-url.up.railway.app`"" -ForegroundColor Gray
Write-Host "   3. Ejecutar índices de BD (ver pasos abajo)" -ForegroundColor White

Write-Host ""
