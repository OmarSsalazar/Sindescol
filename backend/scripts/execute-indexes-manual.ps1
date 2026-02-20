# ============================================================================
# Script Alternativo - Ejecutar Índices Manualmente en Railway
# ============================================================================
# Guía paso a paso para ejecutar el script de índices desde Railway Dashboard
# ============================================================================

Write-Host "📊 Guía: Ejecutar Índices en Railway MySQL (Método Manual)" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

Write-Host "⚠️  El comando mysql no está disponible en tu sistema" -ForegroundColor Yellow
Write-Host "   Usaremos el método manual desde Railway Dashboard" -ForegroundColor Gray
Write-Host ""

# Verificar que el archivo existe
if (-not (Test-Path "database\optimize_indexes.sql")) {
    Write-Host "❌ Archivo database\optimize_indexes.sql no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Archivo de índices encontrado" -ForegroundColor Green
Write-Host ""

# Copiar contenido al clipboard
Write-Host "📋 Copiando contenido al portapapeles..." -ForegroundColor Cyan
try {
    Get-Content "database\optimize_indexes.sql" | Set-Clipboard
    Write-Host "✅ Contenido copiado al portapapeles" -ForegroundColor Green
} catch {
    Write-Host "⚠️  No se pudo copiar automáticamente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Gray
Write-Host "📝 PASOS PARA EJECUTAR EN RAILWAY DASHBOARD" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

Write-Host "`n🔵 Paso 1: Abrir Railway Dashboard" -ForegroundColor Yellow
Write-Host "   1. Ve a: https://railway.app/dashboard" -ForegroundColor White
Write-Host "   2. Selecciona el proyecto 'Sindicato'" -ForegroundColor White

Write-Host "`n🔵 Paso 2: Acceder al servicio MySQL" -ForegroundColor Yellow
Write-Host "   1. Clic en el servicio 'MySQL' (icono de base de datos)" -ForegroundColor White
Write-Host "   2. Espera a que cargue la vista del servicio" -ForegroundColor White

Write-Host "`n🔵 Paso 3: Abrir el Query Editor" -ForegroundColor Yellow
Write-Host "   1. Clic en la pestaña 'Data' (en la parte superior)" -ForegroundColor White
Write-Host "   2. Clic en el botón 'Query' o 'Execute SQL'" -ForegroundColor White
Write-Host "   3. Se abrirá un editor de SQL" -ForegroundColor White

Write-Host "`n🔵 Paso 4: Pegar y ejecutar el script" -ForegroundColor Yellow
Write-Host "   1. En el editor SQL, pegar el contenido (Ctrl+V)" -ForegroundColor White
Write-Host "      El contenido ya está en tu portapapeles ✅" -ForegroundColor Green
Write-Host "   2. Clic en 'Execute' o presiona Ctrl+Enter" -ForegroundColor White
Write-Host "   3. Espera 1-3 minutos mientras se crean los índices" -ForegroundColor White

Write-Host "`n🔵 Paso 5: Verificar resultado" -ForegroundColor Yellow
Write-Host "   Deberías ver mensajes como:" -ForegroundColor White
Write-Host "   • 'Query OK, 0 rows affected'" -ForegroundColor Gray
Write-Host "   • 'Records: 0  Duplicates: 0  Warnings: 0'" -ForegroundColor Gray
Write-Host "   Si aparecen errores de 'Duplicate key name', es normal" -ForegroundColor Gray
Write-Host "   (significa que algunos índices ya existían)" -ForegroundColor Gray

Write-Host "`n🔵 Paso 6: Verificar índices creados" -ForegroundColor Yellow
Write-Host "   Ejecutar esta query en el mismo editor:" -ForegroundColor White
Write-Host "   SHOW INDEX FROM afiliados;" -ForegroundColor Cyan
Write-Host "   Deberías ver múltiples índices listados" -ForegroundColor Gray

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Gray
Write-Host "⏱️  TIEMPO ESTIMADO: 5-10 minutos" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

Write-Host "`n📌 Si el script es muy largo para pegar:" -ForegroundColor Yellow
Write-Host "   1. Dividir en partes (por tabla)" -ForegroundColor White
Write-Host "   2. Ejecutar una sección a la vez" -ForegroundColor White
Write-Host "   3. O usar Railway CLI con plugin MySQL instalado" -ForegroundColor White

# Preguntar si quiere abrir el archivo
Write-Host ""
$open = Read-Host "¿Abrir archivo SQL en editor? (y/n)"
if ($open -eq "y") {
    notepad "database\optimize_indexes.sql"
}

# Preguntar si quiere abrir Railway Dashboard
Write-Host ""
$openDashboard = Read-Host "¿Abrir Railway Dashboard en navegador? (y/n)"
if ($openDashboard -eq "y") {
    Start-Process "https://railway.app/dashboard"
}

Write-Host ""
Write-Host "✅ Cuando termines, ejecuta verify-deployment para probar" -ForegroundColor Green
Write-Host "   .\scripts\verify-deployment.ps1 -AppUrl `"https://tu-url.up.railway.app`"" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 TIP: Guarda la URL de tu app para usarla después" -ForegroundColor Cyan
Write-Host "   Ejemplo: https://sindescol-production.up.railway.app" -ForegroundColor Gray
Write-Host ""
